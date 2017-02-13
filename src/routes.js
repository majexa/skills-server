const fs = require('fs');
const ObjectId = require('mongoose').Types.ObjectId;
const axios = require('axios');
const jwt = require('jsonwebtoken');

function genCode() {
  let text = '';
  let possible = '0123456789';
  for (let i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

let smscSendCmd = function (reply, cmd, arg) {
  let url = 'http://smsc.ru/sys/' + cmd + '.php?' + //
    'login=' + process.env.SMSC_LOGIN + //
    '&psw=' + process.env.SMSC_PASSWORD + '&fmt=1&charset=utf-8&' + arg;
  axios.get(url).then(function (response) {
    if (!response.data) {
      reply({error: 'request problem'}).code(500);
      return;
    }
    let params = response.data.split(',');
    if (params[1] < 0) {
      console.log('SMSC RESULT: ' + response.data);
      reply({error: 'SMSC: sending error'}).code(500);
      return;
    }
    reply({success: 1});
  }).catch(function (error) {
    console.log(error);
  });
};

let sendSms = function (res, phone, message) {
  smscSendCmd(res, "send", "cost=3&phones=" + phone + "&mes=" + message + "&translit=0&id=0&sender=0&time=0");
};

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('<h1>skills-server</h1>')
    }
  },
  /**
   * @api {get} /login Login
   * @apiDescription Token expiration time: 1 week
   * @apiName Login
   * @apiGroup Auth
   *
   * @apiParam {String} phone User phone
   * @apiParam {String} code SMS code
   *
   * @apiSuccess {String} token Token that you will use in Socket.IO connection
   *
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *     "token": "your-token",
   *     "_id": userId
   *    }
   *
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 404 Not Found
   *   {"error": "no user"}
   */
  {
    method: 'GET',
    path: '/api/v1/login',
    handler: (request, reply) => {
      if (!request.query.phone) {
        reply({error: 'phone is required'}).code(500);
        return;
      }
      if (!request.query.code) {
        reply({error: 'SMS code is required'}).code(500);
        return;
      }
      request.db.SmsCode.findOne({
        code: request.query.code,
        phone: request.query.phone
      }, (err, profile) => {
        if (!profile) {
          reply({error: 'no user'});
          return;
        }
        const expiresIn = 60 * 60 * 24 * 7;
        const token = jwt.sign(profile, 'abc', {
          expiresIn: expiresIn
        });
        reply(Object.assign({
          token: token,
          expiresIn: new Date() + expiresIn
        }, profile._doc));
      });
    }
  },
  /**
   * @api {get} /sendCode Send code
   * @apiDescription Sends code by SMS
   * @apiName SendCode
   * @apiGroup Auth
   *
   * @apiParam {String} phone User phone

   * @apiSuccess {String} result Result in JSON
   */
  {
    method: 'GET',
    path: '/api/v1/sendCode',
    handler: (request, reply) => {
      if (!request.query.phone) {
        reply({error: 'phone is required'}).code(500);
        return;
      }
      let code = genCode();
      request.db.SmsCode.find({phone: request.query.phone}).remove().exec((err) => {
        if (err) {
          console.error(err);
          reply({error: 'error'}).code(500);
        }
        const phoneCode = {
          phone: request.query.phone,
          code: code
        };
        request.db.SmsCode.create(phoneCode, (err, result) => {
          if (err) {
            console.error(err);
            reply({error: 'error'}).code(500);
          }
          request.db.User.create({
            phone: request.query.phone
          }, {
            phone: request.query.phone
          }, {
            upsert: true
          }, () => {
            sendSms(reply, phoneCode.phone, phoneCode.code);
          });
        });
      });
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
