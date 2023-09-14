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
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(uploadUserPhoto, registerUser);
router.route("/login").post(loginUser);
router.route("/password-forgot").post(forgotPassword);
router.route("/password-reset/:token").patch(resetPassword);
router.route("/logout").get(logout);

router.use(isAuthenticatedUser);
router.route("/me").get(getUserDetails);
router.route("/update-password").patch(updatePassword);
router.route("/update-me").patch(uploadUserPhoto, updateProfile);
router.route("/").get(authorizeRoles("admin"), getAllUser);
router
  .route("/:id")
  .get(authorizeRoles("admin"), getSingleUser)
  .patch(authorizeRoles("admin"), updateUserRole)
  .delete(authorizeRoles("admin"), deleteUser);

module.exports = router;
