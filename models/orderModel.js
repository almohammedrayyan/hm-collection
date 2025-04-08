const mongoose = require("mongoose");

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
  },
  orderItems: [
    {
      type:Array,
    },
  ],
  user: {
    type: String,
  },
  uniqueOrderId: {
    type: String,
  },
  paymentInfo: {
    id: {
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
