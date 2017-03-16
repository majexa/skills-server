const dbConnect = require('./lib/db');
dbConnect().then((models) => {
  console.log(Object.keys(models));
});

// module.exports = {
//
//   init: (server) => {
//     setInterval(() => {
//     }, 10000);
//   }
//
// };