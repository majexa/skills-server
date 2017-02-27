//const ObjectId = require('mongoose').Types.ObjectId;

module.exports = [{
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
