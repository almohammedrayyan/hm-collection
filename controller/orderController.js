const Order = require("../models/orderModel"); // Adjust the path as needed
const PaymentGatewayModel = require("../models/paymentModals")
const Razorpay = require("razorpay");
// Helper function to generate a unique Order ID
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
    const { shippingInfo, orderItems, user, paymentInfo, totalPrice,paymentMethod } =
      req.body;

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
      paymentMethod,
      paidAt: paymentInfo?.status === "paid" ? Date.now() : null,
    });

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
const getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandling("Order not found with this Id", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
};
const getMyOrder = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
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
module.exports = {
  createOrder,
  getSingleOrder,
  getAllOrders,
  newUserOrder,
  getMyOrder,createPayment,paymentGateway
};
