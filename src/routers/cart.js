const express = require("express");
const auth = require("../middlewares/auth");
const Cart = require("../models/cart");
const cartService = require("../services/cartService");

const router = express.Router();

// List all orders (all)
router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;
    const cartItems = await Cart.find({user: user._id}).populate("product");

    res.json({cartItems});
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Get certain order's details (all)

router.post("/", auth, async (req, res) => {
  const {cartItem} = req.body;
  try {
    const newCartItem = cartService.addCartItem(cartItem, req.user);

    res.status(201).json({newCartItem});
  } catch (error) {
    console.error("Error:", error);
    res.status(error.statusCode).send(error);
  }
});

module.exports = router;
