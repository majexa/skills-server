const Cors = require('hapi-cors');
var colors = require('colors');

process.on('unhandledRejection', (err, promise) => {
  console.error(`Uncaught error in`, promise);
  console.error(err);
});

const debugRoutes = function(routes) {
  for (let route of routes) {
    console.log(route.method.blue + ' ' + route.path.cyan);
  }
  return routes;
};

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
      server.route(debugRoutes(require('./lib/crudRoutes/challenge')));
      server.route(debugRoutes(require('./lib/routes/login')));
      server.start((err) => {
        if (err)
          throw err;
        console.log(`Server running at: ${server.info.uri}`);
      });
    });
  });
};
