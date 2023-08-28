const mongoose = require("mongoose");
const validator = require("validator");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalide email address");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],

  isAdmin: {
    type: Boolean,
    default: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

// Generate authentication token
userSchema.methods.generateJWTtoken = async function () {
  const user = this;
  const token = jwt.sign({_id: user.id.toString()}, "videoTraining");
  user.tokens = user.tokens.concat({token});

  await user.save();
  return token;
};

// Check credentials for login
userSchema.statics.findByCredintials = async function (email, password) {
  const user = await User.findOne({email: email});
  if (!user) {
    throw new Error("Invalid credintials");
  }
  const isMatch = await bycrpt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credintials");
  }
  return user;
};

// Hashing password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bycrpt.hash(user.password, 8);
  }

  next();
});

// Filter user data
userSchema.methods.filterUserData = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.tokens;
  delete userObj.password;
  return userObj;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
