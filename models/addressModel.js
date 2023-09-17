const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Adress must be belong to a user"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  phoneNumber: {
    type: Number,
    required: [true, "Phone number is required"],
    // min: [10, "Phone number should be 10 digits"],
    // max: [10, "Phone number should be 10 digits"],
  },
  pincode: {
    type: Number,
    required: [true, "Pin code is required"],
    // min: [6, "Pin code should be 6 digits"],
    // max: [6, "Pin code should be 6 digits"],
  },
  locality: {
    type: String,
    required: [true, "Locality is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  landmark: String,
  city: {
    type: String,
    required: [true, "City is required"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Address", addressSchema);
