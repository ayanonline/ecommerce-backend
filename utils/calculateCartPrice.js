const { model } = require("mongoose");

const calculateCartPrice = (cart) => {
  const itemsWithSubtotals = cart.items.map((item) => {
    const product = item.product;
    const quantity = item.quantity;
    const subtotal = product.price * quantity;
    return { ...item.toObject(), subtotal };
  });

  let totalAmount = itemsWithSubtotals.reduce(
    (total, item) => total + item.subtotal,
    0
  );

  const shippingPrice = totalAmount >= 500 ? 0 : 40;
  totalAmount += shippingPrice;

  const cartWithSubtotals = {
    ...cart.toObject(),
    items: itemsWithSubtotals,
    shippingPrice,
    totalAmount,
    totalItems: itemsWithSubtotals.length,
  };

  return cartWithSubtotals;
};

module.exports = calculateCartPrice;
