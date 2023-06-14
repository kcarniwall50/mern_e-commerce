const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },

    cartProducts: {
      type: Array,
    },
  },
  { strictQuery: false },
  {
    timestamps: true,
  }
);

const cartModel = mongoose.model("cart", cartSchema);
module.exports = cartModel;
