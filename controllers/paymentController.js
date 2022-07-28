const BigPromise = require("../middlewares/BigPromise");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Razorpay = require("razorpay");

exports.sendStripeKey = BigPromise(async (req, res, next) => {
  res.status(200).send({
    stripekey: process.env.STRIPE_API_KEY,
  });
});

exports.captureStripePayment = BigPromise(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    automatic_payment_methods: { enabled: true },
    //optional
    metadata: {
      integration_check: "accept_a_payment",
    },
  });

  res.status(200).json({
    success: true,
    amount: req.body.amount,
    client_secret: paymentIntent.client_secret,
    payment_id: paymentIntent.id,
  });
});

exports.sendRayzorpayKey = BigPromise(async (req, res, next) => {
  res.status(200).send({
    razorpaykey: process.env.RAZORPAY_API_KEY,
  });
});

exports.captureRayzorpayPayment = BigPromise(async (req, res, next) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const options = {
    amount: req.body.amount,
    currency: "INR",
  };

  const myOrder = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    amount: req.body.amount, // amount in the smallest currency unit (amount * 100)
    order: myOrder,
  });
});
