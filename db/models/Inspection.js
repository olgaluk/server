const mongoose = require('mongoose');

const Inspection = new mongoose.Schema({
  operatorName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  licenseNumber: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  oss: {
    type: String,
    required: true,
  },
  questions: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model('Inspection', Inspection);
