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
  uploadProductPhotos,
  addProductPhotos,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../midleware/auth");

const router = express.Router();

//get all product
router
  .route("/")
  .get(getAllProducts)
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    uploadProductPhotos,
    addProductPhotos,
    createProduct
  );

//get single product details
router.route("/:id").get(getProductDetail);

//update/delete product
router
  .route("/:id")
  .patch(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

//Create/Update Review route
router.route("/review").put(isAuthenticatedUser, createProductReview);

//Delete Review route
router
  .route("/reviews")
  .get(getAllProductReviews)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProductReviews);
module.exports = router;
