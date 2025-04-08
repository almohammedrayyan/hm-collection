const mongoose = require("mongoose");

const paymentGateway = new mongoose.Schema({
  razorpay_order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
});
module.exports = mongoose.model("paymentGateway", paymentGateway);
