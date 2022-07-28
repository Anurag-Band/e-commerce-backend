const express = require("express");
const router = express.Router();

const {
  adminGetAllProducts,
  getAllProducts,
  getOneProduct,
  adminAddProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
  getOnlyReviewsForOneProduct,
} = require("../controllers/productController");

const { isUserLoggedIn, customRole } = require("../middlewares/userMiddleware");

// user Routes
router.route("/products").get(getAllProducts);
router.route("/products/:id").get(getOneProduct);
router
  .route("/review")
  .put(isUserLoggedIn, addReview)
  .delete(isUserLoggedIn, deleteReview);
router.route("/reviews").get(getOnlyReviewsForOneProduct);

// Admin ONLY Routes
router
  .route("/admin/product/add")
  .post(isUserLoggedIn, customRole("admin"), adminAddProduct);

router
  .route("/admin/products")
  .get(isUserLoggedIn, customRole("admin"), adminGetAllProducts);

router
  .route("/admin/product/:id")
  .put(isUserLoggedIn, customRole("admin"), adminUpdateOneProduct)
  .delete(isUserLoggedIn, customRole("admin"), adminDeleteOneProduct);

module.exports = router;
