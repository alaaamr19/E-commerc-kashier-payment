const Order = require("../models/order");
const Product = require("../models/product");
const makeError = require("../utils/makeError");
const {deleteCartItems} = require("./cartService");

module.exports = {
  findById: async function (id) {
    try {
      const order = await Order.findById(id)
        .populate({
          path: "items.product", // Path to the product field in the items array
          model: Product, // Reference the Product model
        })
        .populate("user");
      if (!order) {
        throw makeError("Not Found", "there is no order wih this id", 404);
      }
      return order;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  completeOrder: async function (id) {
    try {
      const order = await Order.findById(id).populate("user");
      if (!order) {
        throw makeError("Not Found", "there is no order wih this id", 404);
      }
      order.paidAt = new Date();
      await order.save();
      await deleteCartItems(order.user);
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
};
