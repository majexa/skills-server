const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  phone: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  }
});