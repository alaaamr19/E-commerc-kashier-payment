const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const user = require("../middlewares/user");

const router = express.Router();

// Register new user
router.post("/", async (req, res) => {
  let data = req.body;
  const dataKeys = Object.keys(req.body);
  const validterms = ["name", "email", "password"];

  dataKeys.forEach((key) => {
    if (!validterms.includes(key)) {
      delete data[key];
    }
  });
  const user = new User(data);
  try {
    await user.save();
    const token = await user.generateJWTtoken();
    res.json({user: user.filterUserData(), token: token});
  } catch (error) {
    res.json(400, error);
  }
});

// Register new admin(admin only)
router.post("/admin", admin, async (req, res) => {
  let data = req.body;
  const dataKeys = Object.keys(req.body);
  const validterms = ["name", "email", "password"];

  dataKeys.forEach((key) => {
    if (!validterms.includes(key)) {
      delete data[key];
    }
  });
  data.isAdmin = true;
  const user = new User(data);
  try {
    await user.save();
    const token = await user.generateJWTtoken();
    res.json({user: user.filterUserData(), token: token});
  } catch (error) {
    res.json(400, error);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredintials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateJWTtoken();

    res.json({user: user.filterUserData(), token: token});
  } catch (error) {
    res.status(400).json({error: error.toString()});
  }
});

// Logout
router.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send("internal server error!");
  }
});

// List all Users for admin
router.get("/", admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users.map((user) => user.filterUserData()));
  } catch (error) {
    res.status(500).send(error);
  }
});

//get my profile
router.get("/me", user, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).send();
    }
    res.json({user: user.filterUserData()});
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete certain user (admin only)
router.delete("/:id", admin, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.deleteOne({_id: _id});
    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
