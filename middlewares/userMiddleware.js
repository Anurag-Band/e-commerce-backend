const User = require("../models/userModel");
const BigPromise = require("./BigPromise");
const CustomError = require("../utils/customError");
const jwt = require("jsonwebtoken");

exports.isUserLoggedIn = BigPromise(async (req, res, next) => {
  let token = req.cookies.token;

  if (!token && req.header("Authorization")) {
    token = req.header("Authorization").replace("Bearer ", "");
  }

  if (!token) {
    return next(new CustomError("Please Log in to Access this Page!!!", 401));
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

exports.customRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("You are not allowed for this resouce", 403));
    }
    next();
  };
};
