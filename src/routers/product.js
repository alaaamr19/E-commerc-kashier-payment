const express = require("express");
const Product = require("../models/product");
const admin = require("../middlewares/admin");
const paginate = require("jw-paginate");

const router = express.Router();

// Add new product(admin only)
router.post("/", admin, async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// List all products (all)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    const page = parseInt(req.query.page) || 1;
    const pager = paginate(products.length, page);

    const productsPage = products.slice(pager.startIndex, pager.endIndex + 1);
    res.json({productsPage, pager});
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findById(_id);

    if (!product) {
      res.status(404).send();
    }

    res.json(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Edit certain product (admin only)
router.patch("/:id", admin, async (req, res) => {
  const _id = req.params.id;

  try {
    let product = await Product.updateOne({_id: _id}, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(400).send();
    }

    res.json(product);
  } catch (error) {
    res.send(400, error);
  }
});

// Delete certain products (admin only)
router.delete("/:id", admin, async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.deleteOne({_id: _id});
    if (!product) {
      res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
