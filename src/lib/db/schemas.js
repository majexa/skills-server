const mongoose = require('mongoose');

module.exports = {
  userSchema: mongoose.Schema({
    registerDate: {
      type: Date,
      default: Date.now
    },
    phone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    }
  }),
  taskSchema: mongoose.Schema({
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
  })
};

