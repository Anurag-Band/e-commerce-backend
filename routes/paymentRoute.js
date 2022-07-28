const express = require("express");
const router = express.Router();

const {
  sendStripeKey,
  sendRayzorpayKey,
  captureStripePayment,
  captureRayzorpayPayment,
} = require("../controllers/paymentController");

const { isUserLoggedIn } = require("../middlewares/userMiddleware");

// user Routes
router.route("/stripekey").get(isUserLoggedIn, sendStripeKey);
router.route("/razorpaykey").get(isUserLoggedIn, sendRayzorpayKey);

router
  .route("/capturestripepayment")
  .post(isUserLoggedIn, captureStripePayment);
router
  .route("/capturerazorpaypayment")
  .post(isUserLoggedIn, captureRayzorpayPayment);

module.exports = router;
