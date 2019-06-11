const mongoose = require('mongoose');

const Call = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  operatorName: {
    type: String,
    required: true,
  },
  idCaller: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '180d',
  },
});

module.exports = mongoose.model('Call', Call);
