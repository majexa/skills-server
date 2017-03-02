const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }
});
