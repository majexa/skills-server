const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  startDt: {
    type: Date
  },
  challengeId: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
