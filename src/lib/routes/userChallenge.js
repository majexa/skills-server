module.exports = [
  {
    method: 'POST',
    path: '/api/v1/userChallenge',
    config: {
      auth: 'user'
    },
    handler: (request, reply) => {
      const authUserId = request.auth.credentials._id;
      request.db.UserChallenge.findOne({
        challenge: request.payload.challengeId,
        user: authUserId,
      }, (err, existingUserChallenge) => {
        if (err) {
          reply({error: err}).code(500);
          return;
        }
        if (existingUserChallenge !== null) {
          reply({error: 'user_challenge_exists'}).code(500);
          return;
        }
        request.db.UserChallenge.create({}, (err, userChallenge) => {
          if (err) {
            reply({error: err}).code(500);
            return;
          }
          console.log(userChallenge);
          request.db.Challenge.findOne({
            _id: request.payload.challengeId
          }, (err, challenge) => {
            if (challenge === null) {
              reply({error: 'no_such_challenge'}).code(500);
              return;
            }
            userChallenge.challenge = challenge;
            request.db.User.findOne({
              _id: authUserId
            }, (err, user) => {
              if (err) {
                reply({error: err}).code(500);
                return;
              }
              if (user === null) {
                reply({error: 'no_such_user'}).code(500);
                return;
              }
              userChallenge.user = user;
              userChallenge.save((err) => {
                if (err) {
                  reply({error: err}).code(500);
                  return;
                }
                reply({success: 1});
              });
            });
          });
        });
      });
    }
  },
  {
    method: 'GET',
    path: '/api/v1/userChallenges',
    config: {
      auth: 'user'
    },
    handler: (request, reply) => {
      request.db.UserChallenge.find({
        user: request.auth.credentials._id
      })
        .populate('challenge')
        .exec(function (err, userChallenges) {
          if (err) {
            reply({error: err}).code(500);
            return;
          }
          reply(userChallenges);
        });
    }
  }


];
