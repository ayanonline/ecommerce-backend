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
router.route("/cart/add").post(isAuthenticatedUser, addToCart);

// Update Cart item
router.route("/cart/update").put(isAuthenticatedUser, updateCart);

// Remove item from cart
router.route("/cart/remove").delete(isAuthenticatedUser, removeItem);

// Retrieve Cart contents
router.route("/cart/:userId").get(isAuthenticatedUser, getAllCart);
module.exports = router;
