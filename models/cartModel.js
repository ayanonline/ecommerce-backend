const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// cartSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: "items",
//     populate: {
//       path: "product",
//       select: "name price thumbnail"
//     },
//   });
//   next();
// })

module.exports = mongoose.model("Cart", cartSchema);
