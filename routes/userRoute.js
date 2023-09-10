const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
  uploadUserPhoto,
  uploadPhoto,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../midleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").patch(resetPassword);
router.route("/logout").get(logout);

router.route("/upload").post(uploadPhoto, uploadUserPhoto);

router.use(isAuthenticatedUser);
router.route("/me").get(getUserDetails);
router.route("/password/update").patch(updatePassword);
router.route("/me/update").patch(updateProfile);
router.route("/admin/users").get(authorizeRoles("admin"), getAllUser);
router
  .route("/admin/user/:id")
  .get(authorizeRoles("admin"), getSingleUser)
  .patch(authorizeRoles("admin"), updateUserRole)
  .delete(authorizeRoles("admin"), deleteUser);

module.exports = router;
