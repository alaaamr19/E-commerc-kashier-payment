const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./db/mongodb");
const userRouter = require("./routers/user");
const orderRouter = require("./routers/order");
const cartRouter = require("./routers/cart");
const productRouter = require("./routers/product");
const paymentCallbackRouter = require("./routers/paymentCallBack");

const User = require("./models/user");

const app = express();
const port = process.env.port || 3000;

app.use(
  cors({
    origin: process.env.APP_URL,
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist/user-interface")));

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/callback", paymentCallbackRouter);
app.use("/api/cart", cartRouter);
// app.use("/paymentWebhook", require("./PaymentWebhook"));

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/user-interface/index.html"));
});

const addSuperUser = async () => {
  const user = await User.findOne({email: "admin@admin.com"});

  if (!user) {
    const admin = new User({
      name: "admin",
      email: "admin@admin.com",
      password: "admin1234",
      isAdmin: true,
    });
    try {
      await admin.save();
      await admin.generateJWTtoken();
    } catch (error) {}
  }
};

addSuperUser();
