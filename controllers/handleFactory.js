const Cart = require("../models/cartModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { Model, model } = require("mongoose");

exports.createOne = (Model, user) =>
  catchAsyncError(async (req, res, next) => {
    if (user) req.body.user = req.user.id;
    const doc = await Model.create(req.body);

    res.status(201).json({
      success: true,
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });

    if (!doc)
      return next(new ErrorHandler("No document found with that id", 404));

    res.status(200).json({
      success: true,
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc)
      return next(new ErrorHandler("No document found with that id", 404));

    res.status(204).json({
      success: true,
    });
  });

exports.getAll = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const doc = await Model.find();

    res.status(200).json({
      success: true,
      data: doc,
    });
  });

exports.getOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc)
      return next(new ErrorHandler("No document found with that id", 404));

    res.status(200).json({
      success: true,
      data: doc,
    });
  });
