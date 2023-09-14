const express = require("express");

const authController = require("../middleware/auth");
const addressController = require("../controllers/addressController");

const router = express.Router();

router.use(authController.isAuthenticatedUser);

router.get("/user-address", addressController.getUserAddress);

router
  .route("/")
  .post(addressController.createAddress)
  .get(addressController.getAllAddress);

router
  .route("/:id")
  .get(addressController.getAddress)
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

module.exports = router;
