module.exports = require('hapi-ngn-grid-mongoose-crud')('userChallenge', {
  startDt: 'Дата старта',
  challengeId: 'ID челенджа',
  userId: 'ID пользователя'
},
{"extendPath":"/user{user}"}
);
