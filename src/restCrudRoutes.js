const ObjectId = require('mongoose').Types.ObjectId;

const items = require('ngn-grid-items');

const ucFirst = function(str) {
  const f = str.charAt(0).toUpperCase();
  return f + str.substr(1, str.length - 1);
};

module.exports = function(name, model, opt) {

  if (!opt) opt = {};
  if (!opt.apiBase) opt.apiBase = '/api/v1/';

  const listRoute = function (modelName, model) {
    const path = opt.apiBase + name + 's';
    return {
      method: 'GET',
      path: path,
      handler: (request, reply) => {
        items(
          {},
          request.params.pg || 1,
          path,
          request.db[modelName],
          model,
          {_id: 'id'},
          (data) => {
            reply(data);
          }
        );
      }
    };
  };

  const modelName = ucFirst(name);

  const readRoute = {
    method: 'GET',
    path: opt.apiBase + name + '/{id}',
    handler: (request, reply) => {
      request.db[modelName].findOne({
        _id: ObjectId(request.params.id)
      }, (err, r) => {
        console.log(r);
        reply(r);
      });
    }
  };

  const createRoute = {
    method: 'POST',
    path: opt.apiBase + name,
    handler: (request, reply) => {
      request.db[modelName].create(request.payload, () => {
        reply('OK');
      });
    }
  };

  const updateRoute = {
    method: 'POST',
    path: opt.apiBase + name + '/{id}',
    handler: (request, reply) => {
      request.db[modelName].findOne({
        _id: ObjectId(request.query.id)
      }, (err, r) => {
        reply(r);
      });
    }
  };

  const deleteRoute = {
    method: 'GET',
    path: opt.apiBase + name + '/{id}/delete',
    handler: (request, reply) => {
      request.db.Challenge.findOne({
        _id: ObjectId(request.query.id)
      }, (err, r) => {
        reply(r);
      });
    }
  };

  return [
    createRoute,
    updateRoute,
    readRoute,
    deleteRoute,
    listRoute(model)
  ];

};
