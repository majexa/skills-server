const ObjectId = require('mongoose').Types.ObjectId;
const items = require('ngn-grid-items');
const ucFirst = function(str) {
  const f = str.charAt(0).toUpperCase();
  return f + str.substr(1, str.length - 1);
};

module.exports = function(name, model, opt) {
  const modelName = ucFirst(name);
  if (!opt) opt = {};
  if (!opt.apiBase) opt.apiBase = '/api/v1/';
  const listRoute = function (name, model) {
    const path = opt.apiBase + name + 's';
    return {
      method: 'GET',
      path: path,
      handler: (request, reply) => {
        if (!request.db[modelName]) {
          throw new Error('Model "' + modelName + '" is not in existing: ' + Object.keys(request.db));
        }
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
  const readRoute = {
    method: 'GET',
    path: opt.apiBase + name + '/{id}',
    handler: (request, reply) => {
      request.db[modelName].findOne({
        _id: ObjectId(request.params.id)
      }, (err, r) => {
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
      console.log('>>>> ' + ObjectId(request.params.id));
      request.db[modelName].update({
        _id: ObjectId(request.params.id)
      }, {
        $set: request.payload
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
    listRoute(name, model)
  ];

};
