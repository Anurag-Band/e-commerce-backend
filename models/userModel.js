const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// 1 ->> create userSchema and assign required fields -> create "User" model from userSchema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: [40, "Name is too long (limit: 40-charecters)"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      validate: [validator.isEmail, "Email is not Valid"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minlength: [6, "Password should be more than 6 char"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    photo: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// methods:-
// 2 ->> Encrypt password using bcryptjs -> use Schema.prototype.pre() method
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

// 3 ->> isValidatedPassword() -> validate password with passed on user password
userSchema.methods.isValidatedPassword = async function (userSendPassword) {
  return await bcrypt.compare(userSendPassword, this.password);
};

// 4 ->> getJwtToken() -> create and return JWT Token -> "_id" of database is to be passed
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// 5 ->> getForgotPasswordToken() -> generate forgot password Token (String)

userSchema.methods.getForgotPasswordToken = function () {
  // - generate a long and random string using crypto.randomByte()
  const forgotToken = crypto.randomBytes(20).toString("hex");

  // - getting a hash -> and make sure to get a hash on Backend
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  // - time of Token
  this.forgotPasswordExpiry =
    Date.now() + process.env.FORGOT_PASSWORD_EXPIRY_TIME * 60 * 1000;

  return forgotToken;
};

module.exports = model("User", userSchema);
