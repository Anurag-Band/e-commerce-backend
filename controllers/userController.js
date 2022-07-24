const User = require("../models/userModel");
const BigPromise = require("../middlewares/BigPromise");
const CustomError = require("../utils/customError");
const CookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");

exports.signup = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("Photo is required for Signup!!!"));
  }

  const { name, email, password } = req.body;

  if (!name || !name || !password) {
    return next(new CustomError("All Fields are Mandatory!!!", 400));
  }

  const file = req.files.photo;

  const result = await cloudinary.v2.uploader.upload(file.tempFileDir, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      public_id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  CookieToken(user, res);
});
