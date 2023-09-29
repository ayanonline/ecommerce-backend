const express = require("express");
const {
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getCheckoutSession,
} = require("../controllers/orderController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// new order route
router
  .route("/checkout-session/:cartId")
  .get(isAuthenticatedUser, getCheckoutSession);

//Get single order details
router.route("/:id").get(isAuthenticatedUser, getSingleOrder);

// get all orders for logged in user
router.route("/").get(isAuthenticatedUser, myOrders);

//Admin order routes
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
