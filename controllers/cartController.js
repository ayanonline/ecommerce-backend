const Cart = require("../models/cartModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// Add item to Cart
exports.addToCart = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  // Find the user's cart (based on your chosen schema option)
  let cart = await Cart.findOne({ user: userId });

  // If the cart doesn't exist, create a new one
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  // Check if the product is already in the cart
  const existingCartItem = cart.items.find(
    (item) => item.product._id.toString() === productId
  );

  if (existingCartItem) {
    existingCartItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  // Save the updated cart
  await cart.save();
  res.status(201).json({
    success: true,
    cart,
  });
});

// Update Cart item
exports.updateCart = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  // Find the cart item to update
  const cartItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!cartItem) {
    return next(new ErrorHandler("Item not found in cart", 404));
  }

  // Update the quantity
  cartItem.quantity = quantity;

  // Save the updated cart
  await cart.save();
  res.status(200).json({
    success: true,
    cart,
  });
});

// Remove item from Cart
exports.removeItem = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  const productId = req.params.id;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  // Find the cart item to remove
  const cartItemIndex = cart.items.findIndex(
    (item) => item.product._id.toString() === productId
  );

  if (cartItemIndex === -1)
    return next(new ErrorHandler("Item not found in cart", 404));

  // Remove the item from the cart
  cart.items.splice(cartItemIndex, 1);

  // Save the updated cart
  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});

// Retrieve Cart contents
exports.getAllCart = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;

  // find the user's Cart
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return next(new ErrorHandler("Cart not found", 400));
  }

  const itemsWithSubtotals = cart.items.map((item) => {
    const product = item.product;
    const quantity = item.quantity;
    const subtotal = product.price * quantity;
    return { ...item.toObject(), subtotal };
  });

  const totalAmount = itemsWithSubtotals.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  const cartWithSubtotals = {
    ...cart.toObject(),
    items: itemsWithSubtotals,
    totalAmount,
    totalItems: itemsWithSubtotals.length,
  };

  res.status(200).json({
    success: true,
    cart: cartWithSubtotals,
  });
});
