const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  createDate: {
    type: Date,
    default: Date.now
  },
  text: {
    type: String,
    required: true
  },
  hasPhoto: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    required: true,
    default: 'photo'
  }
});