const Cors = require('hapi-cors');

process.on('unhandledRejection', (err, promise) => {
  console.error(`Uncaught error in`, promise);
  console.error(err);
});

module.exports = function (config) {
  const dbConnect = require('./lib/db');
  dbConnect().then((models) => {
    const Hapi = require('hapi');
    const server = new Hapi.Server();
    server.connection(config);
    server.decorate('request', 'db', models);
    server.register([
      {
        register: Cors,
        options: {
          origins: ['*'],
          headers: ['x-request', 'x-requested-with', 'authorization', 'Content-Type']
        }
      },
    ], () => {
      server.route(require('./routes'));
      server.start((err) => {
        if (err)
          throw err;
        console.log(`Server running at: ${server.info.uri}`);
      });
    });
  });
};
