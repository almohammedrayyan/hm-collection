const Order = require("../models/orderModel"); // Adjust the path as needed
const PaymentGatewayModel = require("../models/paymentModals")
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Product = require("../models/productModel")
// Helper function to generate a unique Order ID
const nodemailer = require("nodemailer");

const mailTransport = () =>
  nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

exports.sendOrderConfirmationEmail = async (toEmail, userName, orderId, shippingInfo) => {
  const mailOptions = {
    from: `"Halema Collection" <${process.env.MPT_MAIL}>`,
    to: toEmail,
    subject: `Order Received - ${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Hello ${userName},</h2>
          <p style="font-size: 16px; color: #555;">We’ve received your order <strong>#${orderId}</strong>.</p>
          <p style="font-size: 16px; color: #555;">Thank you for shopping with <strong>Halema Collection</strong>! We will notify you once your order is shipped.</p>
          <h4 style="color: #333; margin-top: 30px;">Shipping To:</h4>
          <p style="color: #555; font-size: 15px;">
            ${shippingInfo.address}, ${shippingInfo.city},<br/>
            ${shippingInfo.state}, ${shippingInfo.postalCode},<br/>
            ${shippingInfo.country}<br/>
            Phone: ${shippingInfo.phoneNo}
          </p>
          <hr style="margin: 20px 0;" />
          <p style="font-size: 14px; color: #888;">If you have any questions, reply to this email.</p>
          <p style="font-size: 14px; color: #888;">— The Halema Collection Team</p>
        </div>
      </div>
    `,
  };

  try {
    await mailTransport().sendMail(mailOptions);
    console.log("Order confirmation email sent to:", toEmail);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
};
exports.sendOrderStatusEmail = async (toEmail, userName, orderId, status) => {
  let subject, message;

  if (status === "Shipped") {
    subject = `Your order #${orderId} has been shipped`;
    message = `
      <p>Hi ${userName},</p>
      <p>Good news! Your order <strong>#${orderId}</strong> has been <strong>shipped</strong>.</p>
      <p>You can expect delivery within 5-7 business days.</p>
    `;
  } else if (status === "Delivered") {
    subject = `Your order #${orderId} has been delivered`;
    message = `
      <p>Hi ${userName},</p>
      <p>Your order <strong>#${orderId}</strong> has been <strong>delivered</strong>.</p>
      <p>We hope you enjoy your purchase. Thank you for shopping with Halema Collection!</p>
    `;
  } else {
    return; // Only handle shipped and delivered for now
  }

  const mailOptions = {
    from: `"Halema Collection" <${process.env.MPT_MAIL}>`,
    to: toEmail,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f2f2f2;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: #8a2be2;">Order Update</h2>
          ${message}
          <hr />
          <p style="font-size: 14px; color: #888;">If you have any questions, reply to this email.</p>
          <p style="font-size: 14px; color: #888;">— Halema Collection Team</p>
        </div>
      </div>
    `,
  };

  try {
    await mailTransport().sendMail(mailOptions);
    console.log(`Status update email (${status}) sent to ${toEmail}`);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};
const generateUniqueOrderId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  const randomLetters = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  );

  const randomNumbers = Array.from({ length: 3 }, () =>
    numbers.charAt(Math.floor(Math.random() * numbers.length))
  );

  return randomLetters.join("") + randomNumbers.join("");
};

// Controller: Create Order
const createOrder = async (req, res) => {
  try {
    const { shippingInfo, orderItems, user, paymentInfo, totalPrice, deliveredAt, paidAt } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      uniqueOrderId: generateUniqueOrderId(),
      paymentInfo,
      totalPrice,
      deliveredAt,
      paidAt,
    });

    // ✅ Send order confirmation email
    await sendOrderConfirmationEmail(shippingInfo.email, shippingInfo.firstName, order.uniqueOrderId, shippingInfo);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
    });
  }
};

const getMyOrder = async (req, res, next) => {
  const { user } = req.query; // ✅ get from query parameters

  try {
    const orders = await Order.find({ user });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

const newUserOrder = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Fetch orders for the given user ID
    const orders = await Order.find({ user: userId });

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get all orders ---admin
const getAllOrders = async (req, res, next) => {
  const orders = await Order.find();
  const count = await Order.countDocuments();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    orders,
    totalAmount,
    count,
  });
};
const createPayment = async (req, res) => {
    try {
      const razorPay = new Razorpay({
        key_id: process.env.RAZORAPI_KEY,
        key_secret: process.env.RAZORAPI,
      });
  
      const options = req.body;
  
      const order = await razorPay.orders.create(options);
  
      if (!order) {
        return res.status(500).send("Error: Unable to create payment order");
      }
  
      res.json({ order });
    } catch (err) {
      console.error(err);
  
      res.status(500).send(`Error: ${err.message}`);
    }
  };
const paymentGateway = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
  
      // Verify the signature
      const sha = crypto.createHmac("sha256", process.env.RAZORAPI);
      sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const digest = sha.digest("hex");
  
      if (digest !== razorpay_signature) {
        return res.status(400).json({ msg: "Transaction is not legit!" });
      }
  
      // Create a new instance of the Mongoose model and save the payment information
      const payment = new PaymentGatewayModel({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });
  
      // Save the payment information to the database
      await payment.save();
  
      // Return success response
      res.json({
        success: true,
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        payment,
      });
    } catch (err) {
      console.error(err);
  
      res.status(500).send(`Error: ${err.message}`);
    }
  };
  ///updateOdre

  const updateOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found with this ID" });
      }
  
      if (order.orderStatus === "Delivered") {
        return res.status(400).json({ success: false, message: "You have already delivered this order" });
      }
  
      if (req.body.status === "Shipped") {
        const updateStockPromises = order.orderItems.map((o) => updateStock(o.product, o.qty));
        await Promise.all(updateStockPromises);
      }
  
      order.orderStatus = req.body.status;
  
      if (req.body.status === "Delivered" || req.body.status === "Returned") {
        const deliveryDate = new Date(order.createdAt);
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        order.deliveredAt = deliveryDate;
      }
  
      await order.save({ validateBeforeSave: false });
  
      // ✅ Send status email
      await sendOrderStatusEmail(order.shippingInfo.email, order.shippimgInfo.firstName, order.uniqueOrderId, req.body.status);
  
      res.status(200).json({
        success: true,
        message: `Order status updated to ${req.body.status}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error updating order" });
    }
  };
  
  
  // Helper function to reduce stock
  async function updateStock(productId, quantity) {
    try {
      const product = await Product.findById(productId);
      if (!product) throw new Error("Product not found");
      console.log("Product Before Stock Update:", product); // Log the product
      if (product.stock < quantity) throw new Error("Insufficient stock");
  
      product.stock -= quantity;
      await product.save();
      console.log("Product After Stock Update:", product); // Log the updated product
      return { success: true };
    } catch (error) {
      console.error("Error updating stock:", error); // Log any errors
      return { success: false, error: error.message };
    }
  }
  
module.exports = {
  createOrder,
  getSingleOrder,
  getAllOrders,
  newUserOrder,
  getMyOrder,createPayment,paymentGateway,
  updateOrder
};
