const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  registerDate: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String
  },
  phone: {
    type: String
  },
  token: {
    type: String
  }
});
