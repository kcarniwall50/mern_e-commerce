const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: {
      type: Array,
    },
  },
  {
    timeStamps: true,
  }
);

const productModel = mongoose.model("productData", productSchema);
module.exports = productModel;
