const express = require("express");
const router = express.Router();

const {
  getSingleOrder,
  getAllOrders,
} = require("../Controllers/orderController");
const protector = require("../middleware/protector");

// get all orders
router.get("/api/user/get-orders", protector, getAllOrders);

// get single order
router.get("/api/user/get-order/:id", protector, getSingleOrder);

module.exports = router;
