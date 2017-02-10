'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const schemas = require('./schemas');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

mongoose.connect('mongodb://localhost/skills');

require('modeles');

module.exports = function () {
  return new Promise((resolve, reject) => {
    db.once('open', () => {
      resolve({
        User: mongoose.model('User', schemas.userSchema),
        Task: mongoose.model('Task', schemas.taskSchema),
      });
    });
  });
}
