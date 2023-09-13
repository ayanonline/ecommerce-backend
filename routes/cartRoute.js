const express = require("express");
// iport all controller here

const { isAuthenticatedUser, authorizeRoles } = require("../midleware/auth");
const {
  addToCart,
  updateCart,
  removeItem,
  getAllCart,
} = require("../controllers/cartController");

const router = express.Router();

// Add item to Cart
router.route("/add").post(isAuthenticatedUser, addToCart);

// Update Cart item
router.route("/update").put(isAuthenticatedUser, updateCart);

// Remove item from cart
router.route("/remove").delete(isAuthenticatedUser, removeItem);

// Retrieve Cart contents
router.route("/:userId").get(isAuthenticatedUser, getAllCart);
module.exports = router;
