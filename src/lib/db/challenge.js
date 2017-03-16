const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
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
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
});
