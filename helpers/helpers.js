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

module.exports = { checkEmail, getUserByEmail };