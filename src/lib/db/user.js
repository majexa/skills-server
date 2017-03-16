const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  registerDate: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String
  },
  deviceToken: {
    type: String
  }
});
