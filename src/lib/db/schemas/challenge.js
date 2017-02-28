const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  dt: {
    type: Date,
    default: Date.now,
    required: true
  },
  skillType: {
    type: String
  },
  reportType: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  shortDesc: {
    type: String
  },
  fullDesc: {
    type: String
  },
  price: {
    type: Number
  },
  periodType: {
    type: String
  }
});
