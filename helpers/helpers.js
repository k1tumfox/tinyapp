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
      return database[user];
    } 
  }
  return undefined;
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

// test modularity of helper function
// app.post("/login", (req, res) => {//update to acct urls_login
//   const cUser = getUserByEmail(req.body.email, users, req.body.password);//fcn call
//   console.log(users.userRandomID.password);//tst
//   if (cUser) {
//     req.session.user_id = users[cUser].id;
//     res.redirect("/urls");
//   } else {
//     return res.status(403).send("That email is already registered, or password mismatch");
//   }
// });

module.exports = { checkEmail, getUserByEmail };