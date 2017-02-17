const mongoose = require('mongoose');
const uuid = require('uuid');

module.exports = mongoose.Schema({
  registerDate: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    default: ''
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: uuid.v4
  },
});