const jwt = require("jsonwebtoken");

const getToken = (req) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  return { token: token, decodedtoken: jwt.verify(token, "videoTraining") };
};
module.exports = getToken;
