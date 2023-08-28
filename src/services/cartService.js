const Cart = require("../models/cart");
const Order = require("../models/order");
const makeError = require("../utils/makeError");
const {generateKashierOrderHash} = require("./paymentService");
const {findById} = require("./productService");

const prepareOrder = async function (cartItems) {
  let totalPrice = 0,
    orderItems = [];
  for (const cartItem of cartItems) {
    const product = await findById(cartItem.product);
    orderItems.push({product: product._id, quantity: cartItem.quantity});
    totalPrice = totalPrice + product.price * cartItem.quantity;
  }
  return {orderItems, totalPrice};
};

const calcTotalPrice = async function (cartItems) {
  let totalPrice = 0;
  for (const cartItem of cartItems) {
    const product = await findById(cartItem.product);
    totalPrice = totalPrice + product.price * cartItem.quantity;
  }
  return totalPrice;
};
module.exports = {
  generatePaymentData: async function (orderId, cartItems, user) {
    const totalPrice = await calcTotalPrice(cartItems);
    const orderData = {
      amount: totalPrice,
      currency: "EGP",
      // Unique order using as reference between merchant and kashier
      merchantOrderId: orderId,
      mid: process.env.MID,

      secret: process.env.PAYMENT_API_KEY,
      // your website baseUrl, www.yourwebsite.com
      baseUrl: process.env.KASHIER_BASE_URL,
      //order meta data JSON String
      metaData: JSON.stringify({
        "Customer Name": user.name,
        "Cutomer Email": user.email,
      }),
      //Add merchantRedirect, to redirect to it after making payment.
      merchantRedirect: process.env.REDIRECT_URL,
      //Add display, to choose what the display language do you want ar for arabic and en for english.
      display: "ar",
      //Add failureRedirect, to choose to redirect after first payment failiure or not.
      //, failureRedirect: 'false || true'
      failureRedirect: "true",
      //Add redirectMethod the callback redirection method after payment, using get or post formdata redirection
      //, redirectMethod: 'post || get'
      redirectMethod: "get",
      //Add the following options separated by comma remove or leave empty for all allowed methods.
      //,allowedMethods:"card,wallet,bank_installments"
      allowedMethods: "bank_installments,card",
      serverWebhook: process.env.WEBHOOK_URL,
      brandColor: "rgba(0, 123, 255, 1)",
    };

    //Generate Order Hash
    orderData.hash = generateKashierOrderHash(orderData);

    //Formulate Hosted payment page URL
    let hppUrl =
      `${orderData.baseUrl}?` +
      `merchantId=${orderData.mid}` +
      `&orderId=${orderData.merchantOrderId}` +
      `&amount=${orderData.amount}` +
      `&currency=${orderData.currency}` +
      `&hash=${orderData.hash}` +
      `&merchantRedirect=${orderData.merchantRedirect}` +
      `&metaData=${orderData.metaData ? orderData.metaData : ""}` +
      `&allowedMethods=${
        orderData.allowedMethods ? orderData.allowedMethods : ""
      }` +
      `&failureRedirect=${
        orderData.failureRedirect ? orderData.failureRedirect : ""
      }` +
      `&redirectMethod=${
        orderData.redirectMethod ? orderData.redirectMethod : ""
      }` +
      `&display=${orderData.display ? orderData.display : ""}` +
      `&brandColor=${encodeURIComponent(orderData.brandColor)}` +
      `&mode=${process.env.MODE}`;

    return [hppUrl, totalPrice];
  },

  addCartItem: async function (cartItem, user) {
    try {
      return await Cart.updateOne(
        {user: user._id, product: cartItem.product._id},
        {$set: {quantity: cartItem.quantity}},
        {upsert: true} // Make this update into an upsert
      );
    } catch (error) {
      throw makeError("Server Error", "Something went wrong", 500);
    }
  },

  findByIds: async function (cartItemsIds) {
    const query = {
      _id: {$in: cartItemsIds},
    };
    try {
      const cartItems = await Cart.find(query);
      return cartItems;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  },
  placeOrder: async function (user, cartItems) {
    try {
      let order;
      const {totalPrice, orderItems} = await prepareOrder(cartItems);
      const oldOrder = await Order.findOne({
        userId: user._id,
        paidAt: null,
      }).exec();
      if (oldOrder) order = oldOrder;
      else
        order = await new Order({
          userId: user._id,
        });
      order.totalPrice = totalPrice;
      order.items = orderItems;
      const savedOrder = await order.save();
      return savedOrder;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  deleteCartItems: async function (userId) {
    try {
      await Cart.deleteMany({userId});
    } catch (error) {
      throw makeError("Server error", "Something went wrong", 500);
    }
  },
};
