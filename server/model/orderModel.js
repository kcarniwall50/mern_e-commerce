const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },

    orderDetails: { type: Array, required: true },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("order", orderSchema);
module.exports = order;
