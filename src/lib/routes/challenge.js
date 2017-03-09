//const ObjectId = require('mongoose').Types.ObjectId;

module.exports = [
  {
    method: 'GET',
    path: '/api/v1/ch/{id}',
    handler: (request, reply) => {
      request.db['Challenge'].find({
        _id: request.params.id
      })
        .populate('tasks')
        .exec(function (err, challenges) {
          if (err) console.error(err);
          reply(challenges);
        });
    }
  },
  {
    method: 'GET',
    path: '/api/v1/chs',
    config: {
      //auth: 'user',
      handler: (request, reply) => {
        request.db['Challenge'].find()
          .populate('tasks')
          .exec(function (err, challenges) {
            if (err) console.error(err);
            reply(challenges);
          });
      }
    }
  },
  // {
  //   method: 'GET',
  //   path: '/api/v1/myCha',
  //   config: {
  //     //auth: 'user',
  //     handler: (request, reply) => {
  //       request.db['Challenge'].find()
  //         .populate('tasks')
  //         .exec(function (err, challenges) {
  //           if (err) console.error(err);
  //           reply(challenges);
  //         });
  //     }
  //   }
  // },
  {
    method: 'POST',
    path: '/api/v1/challenge/{id}/uploadImage',
    config: {
      payload: {
        output: 'stream',
        parse: true,
        // allow: 'application/x-www-form-urlencoded'
      }
    },
    handler: (request, reply) => {
      const data = request.payload;
      if (data.file) {
        // var name = data.file.hapi.filename;
        const path = request.uploadsFolder + '/' + request.params.id + '.png';
        console.log('writing to ' + path);
        const file = require('fs').createWriteStream(path);
        file.on('error', function (err) {
          console.error(err)
        });
        data.file.pipe(file);
        data.file.on('end', (err) => {
          reply({
            filename: data.file.hapi.filename,
            headers: data.file.hapi.headers
          });
        })
      }
    }
  }];
