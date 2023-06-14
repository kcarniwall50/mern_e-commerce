const mongoose = require("mongoose");
const reviewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    comment: {
      type: String,
    },
  },
  {
    timeStamps: true,
  }
);

const reviewModel = mongoose.model("userReview", reviewSchema);
module.exports = reviewModel;
