const mongoose = require('mongoose');

const Vendor = new mongoose.Schema({
  operatorName: {
    type: String,
    required: true,
    max: 100,
  },
  date: {
    type: Date,
    required: true,
  },
  country: {
    type: Array,
    required: true,
  },
  vendorName: {
    type: String,
    required: true,
    max: 100,
  },
  picture: {
    type: Object,
    required: false,
  },
  licenseNumber: {
    type: String,
    unique: true,
    required: true,
  },
  licensePicture: {
    type: Object,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: Array,
    required: true,
  },
  schedule: {
    type: Array,
    required: true,
  },
  ingredient: {
    type: Array,
  },
  foodGroup: {
    type: String,
  },
  flag: {
    type: String,
  },
});

module.exports = mongoose.model('Vendor', Vendor);
