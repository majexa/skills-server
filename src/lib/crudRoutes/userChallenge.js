module.exports = [
  {
    method: 'GET',
    //path: opt.apiBase + 'myChallanges',
    path: '/userChallenges',
    handler: (request, reply) => {
      //console.log(Object.keys(request.db));
      request.db['UserChallenge'].find((err, r) => {
        reply(r);
      });
    }
  }
];