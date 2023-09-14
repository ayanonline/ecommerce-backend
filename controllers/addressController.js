const handleFactory = require("./handleFactory");
const catchAsyncError = require("../middleware/catchAsyncError");
const Address = require("../models/addressModel");
const ErrorHandler = require("../utils/errorHandler");

exports.getUserAddress = catchAsyncError(async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  const doc = await Address.find({ user: userId });
  console.log(doc);
  if (!doc)
    return next(new ErrorHandler("No Addresss found with that user id", 404));

  res.status(200).json({
    success: true,
    data: doc,
  });
});

exports.createAddress = handleFactory.createOne(Address, true);
exports.getAllAddress = handleFactory.getAll(Address);
exports.getAddress = handleFactory.getOne(Address);
exports.updateAddress = handleFactory.updateOne(Address);
exports.deleteAddress = handleFactory.deleteOne(Address);
