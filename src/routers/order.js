const express = require("express");
const Order = require("../models/order");
const admin = require("../middlewares/admin");
const paginate = require("jw-paginate");
const auth = require("../middlewares/auth");
const {
  placeOrder,
  generatePaymentData,
  findByIds,
} = require("../services/cartService");
const {findById} = require("../services/orderService");

const router = express.Router();

// List all orders (all)
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user");
    const page = parseInt(req.query.page) || 1;
    const pager = paginate(orders.length, page);

    const ordersPage = orders.slice(pager.startIndex, pager.endIndex + 1);
    res.json({pager, ordersPage});
  } catch (error) {
    res.send(500, error);
  }
});

// Get certain order's details (all)
router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const order = await findById(_id);
    console.log(order);
    res.status(200).json({order});
  } catch (error) {
    res.status(error.statusCode || 500).json({...error});
  }
});

router.post("/", auth, async (req, res) => {
  const {cartItemsIds} = req.body;
  try {
    const cartItems = await findByIds(cartItemsIds);
    const newOrder = await placeOrder(req.user, cartItems);
    const [hppUrl, totalPrice] = await generatePaymentData(
      newOrder._id,
      cartItems,
      req.user
    );
    res.status(201).json({order: newOrder, hppUrl, totalPrice});
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error);
  }
});

module.exports = router;
