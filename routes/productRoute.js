const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  deleteProductReviews,
  getAllProductReviews,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../midleware/auth");

const router = express.Router();

//get all product
router.route("/").get(getAllProducts);

//get single product details
router.route("/:id").get(getProductDetail);

//create product
router
  .route("/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

//update/delete product
router
  .route("/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

//Create/Update Review route
router.route("/review").put(isAuthenticatedUser, createProductReview);

//Delete Review route
router
  .route("/reviews")
  .get(getAllProductReviews)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProductReviews);
module.exports = router;
