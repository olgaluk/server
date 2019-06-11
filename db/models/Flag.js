const mongoose = require('mongoose');

const Flag = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d',
  },
});

module.exports = mongoose.model('Flag', Flag);
