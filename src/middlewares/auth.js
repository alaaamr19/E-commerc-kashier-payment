const User = require("../models/user");
const getToken = require("../config/jwtConfig");

const auth = async (req, res, next) => {
  try {
    const tokenObj = getToken(req);
    const user = await User.findOne({
      _id: tokenObj.decodedtoken._id,
      "tokens.token": tokenObj.token,
    });
    if (!user) {
      throw new Error("Not Authenticated");
    }
    req.user = user;
    req.token = tokenObj.token;
    next();
  } catch (error) {
    res.status(403).send("Not Authenticated");
  }
};

module.exports = auth;
