const Cart = require("../models/cartModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../midleware/catchAsyncError");

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
    (item) => item.product.toString() === productId
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
    return res
      .status(404)
      .json({ success: false, message: "Item not found in cart" });
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
  const { productId } = req.body;

  // Find the user's cart
  const cart = await Cart.findOne({ user: userId });

  // Find the cart item to remove
  const cartItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (cartItemIndex === -1) {
    res.status(404).json({ success: false, message: "Item not found in cart" });
  }

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
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items",
    populate: {
      path: "product",
      select: "name price thumbnail quantity",
    },
  });

  if (!cart) {
    return res.status(400).json({
      success: false,
      message: "Cart not found",
    });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});
