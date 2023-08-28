const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
