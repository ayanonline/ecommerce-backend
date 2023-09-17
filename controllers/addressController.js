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

exports.createAddress = catchAsyncError(async (req, res, next) => {
  // Create a new address and set it selected for the new user
  const newAddress = await Address.create({
    ...req.body,
    user: req.user.id, // set the user ID based on the authenticated user
    selected: true, // Set the newly created address as selected
  });

  // Deselect the previously selected address, if any
  await Address.updateMany(
    { user: req.user.id, _id: { $ne: newAddress._id } },
    { selected: false }
  );

  res.status(201).json({
    success: true,
    data: newAddress,
  });
});

exports.updateAddress = catchAsyncError(async (req, res, next) => {
  // Find the current address data, including the selected status
  const currentAddress = await Address.findById(req.params.id);

  // Check if the address exists
  if (!currentAddress)
    return next(new ErrorHandler("No Address found with that id", 404));

  // Check if the "selected" field is present in req.body
  if (req.body.selected !== undefined) {
    // If "seleted is set to true, select the address; otherwise, leave it as it was"
    if (req.body.selected) {
      // Deselect all other address for the same user
      await Address.updateMany(
        { user: currentAddress.user },
        { selected: false }
      );
    } else {
      req.body.selected = currentAddress.selected; // User can't make an address selected to false,
    }
  } else {
    // If 'selected' is not present in req.body, keeep the current 'as it was'
    req.body.selected = currentAddress.selected;
  }

  // Update the address with the new data
  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    { $set: req.body }, // Use $set to update only the specified fields
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: updatedAddress,
  });
});

exports.getAllAddress = handleFactory.getAll(Address);
exports.getAddress = handleFactory.getOne(Address);
exports.deleteAddress = handleFactory.deleteOne(Address);
