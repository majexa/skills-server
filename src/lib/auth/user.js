'use strict';

module.exports = function(server) {
    server.auth.strategy('user', 'bearer-access-token', {
        allowQueryToken: false,              // optional, true by default
        allowMultipleHeaders: false,        // optional, false by default
        accessTokenName: 'access_token',    // optional, 'access_token' by default
        validateFunc: function (token, callback) {

            // For convenience, the request object can be accessed
            // from `this` within validateFunc.
            let request = this;

            request.db.User.findOne({
                token: token
            }).then((user) => {
                if (user) {
                    return callback(null, true, {
                        _id: user._id,
                        phone: user.phone,
                        evotorUuid: user.evotorUuid,
                        registerDate: user.registerDate
                    });
                } else {
                    return callback(null, false, { token: token });
                }
            }).catch((err) => {
                return callback(err, false, { token: token });
            });
        }
    });

}
