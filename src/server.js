const Inert = require('inert');
const Cors = require('hapi-cors');
const colors = require('colors');

process.on('unhandledRejection', (err, promise) => {
  console.error(`Uncaught error in`, promise);
  console.error(err);
});

const debugRoutes = function (routes) {
  for (let route of routes) {
    console.log(route.method.blue + ' ' + route.path.cyan);
  }
  return routes;
};

module.exports = function (config) {
  const dbConnect = require('./lib/db');
  dbConnect().then((models) => {
    const Hapi = require('hapi');
    const Path = require('path');
    const uploadsFolder = Path.join(__dirname, '../uploads');
    const server = new Hapi.Server({
      connections: {
        routes: {
          files: {
            relativeTo: uploadsFolder
          }
        }
      }
    });
    server.connection(config);
    server.register(Inert, (err) => {
      if (err) throw err;
    });
    server.decorate('request', 'db', models);

    server.decorate('request', 'uploadsFolder', uploadsFolder);

    server.register([
      {
        register: require('good'),
        options: {
          // ops: {
          //   interval: 1000
          // },
          // subscribers: {
          //   'console': ['ops', 'log', 'request', 'error', 'payload']
          // },
          // logPayloads: true,
          // includes: {
          //   request: ['payload'],
          //   response: ['payload']
          // },
          reporters: {
            console: [{
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{error: '*', log: '*', request: '*', response: '*'}]
            }, {
              module: 'good-console'
            }, 'stdout']
          }
        }
      },
      {
        register: Cors,
        options: {
          origins: ['*'],
          headers: ['x-request', 'x-requested-with', 'authorization', 'Content-Type']
        }
      },
      {"register": require('hapi-auth-bearer-token')}
    ], (error) => {
      if (error)
        return console.error(error);
      require('./lib/auth/user')(server);
      server.route(debugRoutes(require('./lib/crudRoutes/challenge')));
      server.route(debugRoutes(require('./lib/crudRoutes/userChallenge')));
      server.route(debugRoutes(require('./lib/crudRoutes/user')));
      server.route(debugRoutes(require('./lib/crudRoutes/task')));
      server.route(debugRoutes(require('./lib/routes/login')));
      server.route(debugRoutes(require('./lib/routes/challenge')));
      server.route(debugRoutes(require('./lib/routes/userChallenge')));
      server.start((err) => {
        if (err)
          throw err;
        console.log(`Server running at: ${server.info.uri}`);
      });
    });
  });
};
