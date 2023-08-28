const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {type: Date, default: Date.now}, // Creation date field with a default value of the current date
  paidAt: {type: Date, default: null},

  items: [
    {
      product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
      quantity: Number,
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
