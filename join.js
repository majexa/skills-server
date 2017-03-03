mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/join');

var userSchema = mongoose.Schema({
  nickname: String,
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'Friend'}]
});

var friendSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  addTime: Date
});

var User = mongoose.model('User', userSchema);
var Friend = mongoose.model('Friend', friendSchema);

var masted = new User({
  nickname: 'masted'
});

// masted.save(function(err) {
//   if (err) console.error(err);
//   var friend1 = new Friend({
//     user: masted._id
//   });
//   friend1.save(function(err) {
//     if (err) console.error(err);
//     console.log(friend1);
//   });
// });

Friend
  .find({
  })
  .populate('user')
  .exec(function (err, friends) {
    if (err) return console.log(err);
    for (let friend of friends) {

      if (friend.user && friend.user.nickname) {
        console.log('>> ' + friend.user.nickname);
      } else {
        console.log('>> NO NICKNAME');
      }

    }

  });
//if (err) return console.log(err);
//console.log(friend.user.nickname);
//console.log('The friend is %s', friend.user.nickname);
//});

//
//
//
//
//
//
//
// //
// //
// //
// // mongoose.Schema({
// //   dt: {
// //     type: Date,
// //     default: Date.now,
// //     required: true
// //   },
// //   skillType: {
// //     type: String
// //   },
// //   reportType: {
// //     type: String
// //   },
// //   title: {
// //     type: String,
// //     required: true
// //   },
// //   shortDesc: {
// //     type: String
// //   },
// //   fullDesc: {
// //     type: String
// //   },
// //   price: {
// //     type: Number
// //   },
// //   periodType: {
// //     type: String
// //   }
// // });