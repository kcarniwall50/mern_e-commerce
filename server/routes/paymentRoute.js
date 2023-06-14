const express = require("express");
const router = express.Router();
const {
  orderCreate,
  cartDetail,
} = require("../Controllers/paymentControllers");
const protector = require("../middleware/protector");

router.post("/api/payment/orderCreate", protector, orderCreate);
router.post("/api/payment/cartDetail", protector, cartDetail);

module.exports = router;
