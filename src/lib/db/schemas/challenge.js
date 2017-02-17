const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  dateCreate: {
    type: Date,
    default: Date.now,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number
  },
  periodType: {
    type: String
  }
});
