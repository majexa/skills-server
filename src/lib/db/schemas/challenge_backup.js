const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  createDate: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: String
  }
});