const express = require("express");
const { createOrder, getSingleOrder, getMyOrder, getAllOrders, newUserOrder, createPayment, paymentGateway, updateOrder } = require("../controller/orderController");
const router = express.Router();
router.route("/order/new").post(createOrder);
router.route("/orders/me").get(getMyOrder);
router.route("/admin/orders").get(getAllOrders);
router.route("/user/one-order/:id").get(newUserOrder);
router.route("/admin/payment").post(createPayment);
router.route("/admin/validate/payment").post(paymentGateway);
router.route("/orders/:id").get(getSingleOrder);
router.route("/admin/order/:id").put(updateOrder);
module.exports = router;

