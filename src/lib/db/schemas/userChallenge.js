const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  startDt: {
    type: Date,
    default: Date.now
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
