const Product = require("../models/product");
const makeError = require("../utils/makeError");

module.exports = {
  findByIds: async function (productsIds) {
    const query = {
      _id: {$in: productsIds},
    };
    try {
      const products = await Product.find(query);
      return products;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },

  findById: async function (id) {
    try {
      const product = await Product.findById(id).populate("user");
      if (!product) {
        throw makeError("Not Found", "there is no Product wih this id", 404);
      }
      return product;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
};
