const items = require('./items');
const fs = require('fs');
const Inert = require('inert');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('<h1>skills-server</h1>')
    }
  },
  {
    method: 'GET',
    path: '/api/v1/tasks/items',
    handler: (request, reply) => {
      items(
        {},
        request.params.pg || 1,
        'http://localhost:8070/api/v1/tasks/items',
        request.db.Task,
        {
          createDate: 'Дата',
          text: 'Задание',
          type: 'Тип',
          hasPhoto: 'Фото'
        },
        {
          _id: 'id',
          hasPhoto: function (hasPhoto, item) {
            if (hasPhoto) {
              return item._id;
            }
            return false;
          }
        },
        (data) => {
          reply(data);
        }
      );
    }
  },
  {
    method: 'POST',
    path: '/api/v1/tasks',
    handler: (request, reply) => {
      request.db.Task.create({text: request.payload.text}, function (err, small) {
        reply('OK');
      });
    }
  },
  {
    method: 'POST',
    path: '/api/v1/tasks/{id}/uploadPhoto',
    // request.
    handler: (request, reply) => {
      require("fs").writeFile(__dirname + '/../public/upload/task/' + request.params.id + '.png', request.payload.imageData, 'base64', function (err) {
        request.db.Task.update({
          _id: ObjectId(request.params.id)
        }, {
          $set: {
            hasPhoto: true
          }
        }, function () {
          reply('OK');
        });
      });
    }
  }
];
