const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');                    // [1]
const server = new Hapi.Server();
server.connection({ port: 8051 });
server.register(Inert, (err) => {                  // [2]
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {                                     // [3]
      directory: {                                 // [3]
        path: Path.join(__dirname, 'public'),      // [3]
        listing: true                              // [3]
      }                                            // [3]
    }                                              // [3]
  });
  server.start((err) => {
    console.log(`Server running at: ${server.info.uri}`);
  });
});