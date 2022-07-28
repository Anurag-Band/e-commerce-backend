const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getLoggedInUserDetails,
  updatePassword,
  updateUserDetails,
  adminAllUsers,
  managerAllUsers,
  adminGetOneUser,
  adminUpdateOneUserDetails,
  adminDeleteOneUser,
} = require("../controllers/userController");

const { isUserLoggedIn, customRole } = require("../middlewares/userMiddleware");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(isUserLoggedIn, getLoggedInUserDetails);
router.route("/password/update").post(isUserLoggedIn, updatePassword);
router.route("/userdashboard/update").post(isUserLoggedIn, updateUserDetails);

// admin only routes
router
  .route("/admin/users")
  .get(isUserLoggedIn, customRole("admin"), adminAllUsers);

router
  .route("/admin/user/:id")
  .get(isUserLoggedIn, customRole("admin"), adminGetOneUser)
  .put(isUserLoggedIn, customRole("admin"), adminUpdateOneUserDetails)
  .delete(isUserLoggedIn, customRole("admin"), adminDeleteOneUser);

// manager only route
router
  .route("/manager/users")
  .get(isUserLoggedIn, customRole("manager"), managerAllUsers);

module.exports = router;
