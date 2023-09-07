const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../midleware/auth");

const router = express.Router();

// new order route
router.route("/order/new").post(isAuthenticatedUser, newOrder);

//Get single order details
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

// get all orders for logged in user
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

//Admin order routes
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrderStatus)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
