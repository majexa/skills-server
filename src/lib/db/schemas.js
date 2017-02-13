const mongoose = require('mongoose');
const uuid = require('uuid');

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
	  token: {
		  type: String,
		  required: true,
		  unique: true,
		  default: uuid.v4
	  },
  }),
  smsCodeSchema: mongoose.Schema({
    phone: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
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

