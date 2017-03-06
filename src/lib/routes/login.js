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
  if (!process.env.SMSC_LOGIN) throw new Error('.env.SMSC_LOGIN it node defined');
  if (!process.env.SMSC_PASSWORD) throw new Error('.env.SMSC_PASSWORD it node defined');
  let url = 'http://smsc.ru/sys/' + cmd + '.php?' + //
    'login=' + process.env.SMSC_LOGIN + //
    '&psw=' + process.env.SMSC_PASSWORD + '&fmt=3&charset=utf-8&' + arg;
  axios.get(url).then(function (response) {
    if (!response.data) {
      reply({error: 'request problem'}).code(500);
      return;
    }
    if (response.data.error) {
      reply(response.data).code(500);
      return;
    }
    if (response.data.cnt) {
      reply({sucess: 1});
    }
  }).catch(function (error) {
    console.log(error);
  });
};

let sendSms = function (res, phone, message) {
  message = process.env.TITLE + ' Code:\n' + message;
  smscSendCmd(res, "send", "cost=3&phones=" + phone + "&mes=" + message + "&translit=0&id=0&sender=0&time=0");
};

// const convertPostArrays = function (_data) {
//   const keys = Object.keys(_data);
//   const values = Object.values(_data);
//   let data = {};
//   for (let i = 0; i < keys.length; i++) {
//     let m = keys[i].match(/(.*)\[(\d+)\]\[(\w+)\]$/);
//     if (m) {
//       if (!data[m[1]]) data[m[1]] = [];
//       if (!data[m[1]][m[2]]) data[m[1]][m[2]] = {};
//       data[m[1]][m[2]][m[3]] = values[i];
//     } else {
//       m = keys[i].match(/(.*)\[(\d+)\]$/);
//       if (m) {
//         if (!data[m[1]]) data[m[1]] = [];
//         data[m[1]].push(values[i]);
//       } else {
//         data[keys[i]] = values[i];
//       }
//     }
//   }
//   return data;
// };

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
  }
];
