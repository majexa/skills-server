const mongoose = require('mongoose');
module.exports = require('hapi-ngn-grid-mongoose-crud')('task', {
  description: 'Название',
  challengeId: 'Челлендж'
}, {
  extendPath: '/challenge{challengeId}'
});
