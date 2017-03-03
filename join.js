
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

// var masted = new User({
//   nickname: 'masted'
// });
//
// masted.save(function(err) {
//   if (err) console.error(err);
//   var friend1 = new Friend({
//     _user: masted._id
//   });
//   friend1.save(function(err) {
//     if (err) console.error(err);
//     console.log(friend1);
//   });
// });

Friend
  .findOne({
    _id: mongoose.Types.ObjectId('58b90fd4b5be7918adb326dd')
  })
  .populate('user')
  .exec(function (err, friend) {
    if (err) return console.log(err);
    console.log(friend);
    //console.log('The friend is %s', friend.user.nickname);
  });

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