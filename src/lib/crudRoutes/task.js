module.exports = require('hapi-ngn-grid-mongoose-crud')('task', {
  description: 'Название'
}, {
  extendPath: '/challenge{challengeId}'
});
