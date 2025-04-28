const mongoose = require("mongoose");
const customizeProductSchema = new mongoose.Schema({
  size: { type: String },
  type: { type: String },
  price: { type: Number },
  length: { type: String },
  chest: { type: String },
  hips: { type: String },
  sleeve: { type: String },
  shoulder: { type: String },
  color: { type: String },
  description: { type: String },
}, { _id: false }); // Disable _id inside subdocument if you don't want it

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    phoneNumber: {
      type: Number,
    },
    whatsAppNumber: {
      type: Number,
    },
  },
  orderItems: [
    {
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      size: {
        type: String,
      },
      color: {
        type: String,
      },
      discountPercentage:{
        type:String,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
      customizeProduct: customizeProductSchema,
    },
  ],
 
  user: {
    type: String,
  },
  uniqueOrderId: {
    type: String,
  },
  paymentInfo: {
    method: {
      type: String,
    },
    status: {
      type: String,
      default:"not paid"
    },
  },
  paidAt: {
    type: Date,
  },

  totalPrice: {
    type: Number,
    default: 0,
  },
  orderStatus: {
    type: String,
    // required: true,
    default: "Processing",
  },
  deliveredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  qr: {
    type: String, // You can change the type based on the actual data type you want
  },

});
module.exports = mongoose.model("Order", orderSchema);
