const bcrypt = require('bcrypt');

const checkEmail = (data, req) => { 
  for (let key in data) {
    if (data[key].email === req.body.email) {
      return true;
    }
  }
  return false;
};

const getUserByEmail = function(email, database, pass) {
  for (let user in database) {
    if (database[user].email === email && bcrypt.compareSync(pass, database[user].password)) {
      return user;
    } 
  }
  return false;
};

// app.post("/login", (req, res) => {//update to acct urls_login
//   for (let user in users) {

//     if (users[user].email === req.body.email) {
//       console.log("that email is already registered!");//tst
//       // if (users[user].password !== req.body.password) {
//       if (!bcrypt.compareSync(req.body.password, users[user].password)) {  //here
//         console.log("Password does not match!");//tst
//         return res.status(403).send("Password mismatch");
//       } else {
//         console.log(users[user].id);
//         console.log(user);
//         req.session.user_id = users[user].id;
//         res.redirect("/urls");
//         return;
//       }
//     } 
//   }
//   return res.status(403);
// });

module.exports = { checkEmail, getUserByEmail };