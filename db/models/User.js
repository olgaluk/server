const mongoose = require('mongoose');

const User = new mongoose.Schema({
  position: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  organization: {
    type: String,
    required: true,
  },
  task: {
    type: Array,
    required: true,
  },
  country: {
    type: String,
  },
});

module.exports = mongoose.model('User', User);
