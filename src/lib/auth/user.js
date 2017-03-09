module.exports = function (server) {
  server.auth.strategy('user', 'bearer-access-token', {
    allowQueryToken: false,              // optional, true by default
    allowMultipleHeaders: false,        // optional, false by default
    accessTokenName: 'access_token',    // optional, 'access_token' by default
    validateFunc: function (token, callback) {
      let request = this;
      request.db.User.findOne({
        token: token
      }, {
        _id: 1,
        phone: 1,
      }).then((user) => {
        if (user) {
          return callback(null, true, user);
        } else {
          return callback(null, false, {token: token});
        }
      }).catch((err) => {
        return callback(err, false, {token: token});
      });
    }
  });
};
