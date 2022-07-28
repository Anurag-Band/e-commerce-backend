const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOneOrder,
  getLoggedInUserOrders,
  adminGetAllOrders,
  adminUpdateOrder,
  adminDeleteOrder,
} = require("../controllers/orderController");

const { isUserLoggedIn, customRole } = require("../middlewares/userMiddleware");

// user Routes
router.route("/order/create").post(isUserLoggedIn, createOrder);
router.route("/order/:id").get(isUserLoggedIn, getOneOrder);
router.route("/myorders").get(isUserLoggedIn, getLoggedInUserOrders);

// admin ONLY Routes
router
  .route("/admin/orders")
  .get(isUserLoggedIn, customRole("admin"), adminGetAllOrders);

router
  .route("/admin/order/:id")
  .put(isUserLoggedIn, customRole("admin"), adminUpdateOrder)
  .delete(isUserLoggedIn, customRole("admin"), adminDeleteOrder);

module.exports = router;
