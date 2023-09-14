const express = require("express");

const authController = require("../middleware/auth");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.use(authController.isAuthenticatedUser);

router.route("/").get(cartController.getAllCart).post(cartController.addToCart);

router
  .route("/:id")
  .patch(cartController.updateCart)
  .delete(cartController.removeItem);

module.exports = router;
