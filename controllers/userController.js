const User = require("../models/userModel");
const BigPromise = require("../middlewares/BigPromise");
const CustomError = require("../utils/customError");
const CookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const emailHelper = require("../utils/emailHelper");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return next(new CustomError("Photo is required for Signup!!!"));
  }

  const { name, email, password } = req.body;

  if (!name || !name || !password) {
    return next(new CustomError("All Fields are Mandatory!!!", 400));
  }

  const file = req.files.photo;

  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
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

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError("All Fields are Mandatory!!!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new CustomError("User Not Found, Please Register!!!", 400));
  }

  const isPasswordCorrect = await user.isValidatedPassword(password);

  if (!isPasswordCorrect) {
    return next(
      new CustomError("Email or Password is Not Exist or Matching!!!", 400)
    );
  }

  CookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User is Logged Out Successfully!!!",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError("User does not Existes, Please Register!!!"));
  }

  const forgotToken = await user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;

  try {
    await emailHelper({
      toEmail: user.email,
      subject: "DEV Tshirt Store - Password Reset Email",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email Sent Successfully!!!",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new CustomError(error.message, 500));
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encrypToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    encrypToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Token is Invalid or Expired!!!", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new CustomError("password and confirm password do not match!!!", 400)
    );
  }

  user.password = req.body.password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  CookieToken(user, res);
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = BigPromise(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId).select("+password");

  const isOldPasswordCorrect = await user.isValidatedPassword(
    req.body.oldPassword
  );

  if (!isOldPasswordCorrect) {
    return next(new CustomError("Old Password is not Correct!!!", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  CookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return next(new CustomError("Email and Password are Required!!!"));
  }
  const newData = {
    name,
    email,
  };

  if (req.files) {
    const user = await User.findById(res.user.id);

    const imageId = user.photo.public_id;

    const resp = await cloudinary.v2.uploader.destroy(imageId);

    const result = await cloudinary.v2.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folder: "users",
        width: 150,
        crop: "scale",
      }
    );

    newData.photo = {
      public_id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

exports.adminGetOneUser = BigPromise(async (req, res, next) => {
  const users = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    users,
  });
});

exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
  const { name, email, role } = req.body;

  const newData = {
    name,
    email,
    role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new CustomError("No Such User Found!!!"), 401);
  }

  const imageId = user.photo.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    succes: true,
    message: "User Deleted Successfully!!!",
  });
});

exports.managerAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({ role: "user" });

  res.status(200).json({
    success: true,
    users,
  });
});
