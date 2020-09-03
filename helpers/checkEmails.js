const checkEmail = (data, req) => { 
  for (let key in data) {
    if (data[key].email === req.body.email) {
      return true;
    }
  }
  return false;
};

module.exports = checkEmail;

// to restore embedded function:
// - remove from express_server.js,
// if (checkEmail(users, req)) {
//   console.log("that email is already registered!");//tst
//   return res.statusCode = 400;
// }

// - add to express_server.js, 
  // for (let key in users) {         //moved to helper dir
  //   // console.log(users[key]);
  //   if (users[key].email === req.body.email) {
  //     console.log("that email is already registered!");//tst
  //     return res.statusCode = 400;
  //   }
  // } 