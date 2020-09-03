const checkEmail = (data, req) => { 
  for (let key in data) {
    if (data[key].email === req.body.email) {
      return true;
    }
  }
  return false;
};

module.exports = checkEmail;