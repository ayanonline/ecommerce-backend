const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");
const upload = require("../config/awsS3");
const handleFactory = require("./handleFactory");

exports.uploadProductPhotos = upload.fields([
  {
    name: "thumbnail",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 6,
  },
]);

exports.addProductPhotos = (req, res, next) => {
  // console.log(req.files);
  if (req.files && req.files.thumbnail) {
    req.body.thumbnail = req.files.thumbnail[0].location;
  }

  req.body.images = [];
  if (req.files?.images) {
    req.files.images.forEach((item) => req.body.images.push(item.location));
  }
  next();
};

//Create Product -Admin
exports.createProduct = handleFactory.createOne(Product, true);

//Get all products
exports.getAllProducts = catchAsyncError(async (req, res) => {
  let limit;
  if (req.query.limit) {
    limit = Number(req.query.limit);
  } else {
    limit = 7;
  }

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .serach()
    .filter()
    .pagination(limit);

  //without pagination
  const apiFeaturesforcount = new ApiFeatures(Product.find(), req.query)
    .serach()
    .filter();

  // this is return all products without pagination
  const serachProducts = await apiFeaturesforcount.query;

  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    products,
    total: serachProducts.length,
    limit,
  });
});

//Get product details
exports.getProductDetail = handleFactory.getOne(Product);

//Update product --Admin
exports.updateProduct = handleFactory.updateOne(Product);

//Delete product --Admin
exports.deleteProduct = handleFactory.deleteOne(Product);

// Create new Review or Update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // for average ratings
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    review,
  });
});

// Get all reviews of a products
exports.getAllProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Reviews
exports.deleteProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  // for average ratings
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
