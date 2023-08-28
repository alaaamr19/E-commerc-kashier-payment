const express = require("express");
const {completeOrder} = require("../services/orderService");
const router = express.Router();
const {validateSignature} = require("../services/paymentService");
const {deleteCartItems} = require("../services/cartService");

router.get("/", async function (req, res) {
  console.log(req.query, req.params, req.body);
  if (req.query.signature) {
    if (validateSignature(req.query, process.env.PAYMENT_API_KEY)) {
      await completeOrder(req.query.merchantOrderId);
      await deleteCartItems(user);
      const redirectUrl = `${process.env.APP_URL}/products`;
      const template = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Inline EJS Example</title>
      </head>
      <body>
        <a href= "${redirectUrl}">Return back to the homePage</a>
      </body>
      </html>
    `;
      res.send(template);
    } else res.send("not matched signature");
  } else {
    res.send("success signature");
  }
});

module.exports = router;
