const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// cosnt bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const checkEmail = require('./helpers/checkEmails');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));//shows every route
app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],
}));
app.set("view engine", "ejs");

function generateRandomString() {
  return Math.random().toString(36).substring(2,8);
}

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user2RandomID" },
  "9sm5xK": { longURL: "https://www.tsn.ca/soccer", userID: "userRandomID" }
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "3" //purple-monkey-dinosaur
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
//--------------------------GETS---------------------------------
app.get("/login", (req, res) => {
  // let templateVars = {
  //   //email, password
  // };
  let templateVars = {
    user: users[req.session['user_id']], //user.email
    // username: req.cookies["username"]
  }
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => { //registration page
  let templateVars = {
    user: users[req.session['user_id']], //user.email
    // username: req.cookies["username"]
  }
  res.render("urls_reg", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {//@#$%  
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let templateVars = { 
      user: users[req.session['user_id']], //tried exception of req.cookie instead of cookies
      // username: req.cookies["username"],
      urls: urlDatabase 
    };
    res.render("urls_index", templateVars);
  }
});

const urlsForUser = function(id) {
  
}

app.get("/urls/new", (req, res) => {  //@#$%
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let templateVars = {
      user: users[req.session['user_id']],
      // username: req.cookies["username"]
    }
    res.render("urls_new", templateVars);
  }

});

app.get("/urls/:shortURL", (req, res) => {  
  let templateVars = { 
    // username: req.cookies["username"],
    user: users[req.session['user_id']],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL
  };
  res.render("urls_show", templateVars); 
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  console.log("longURL", longURL);
  res.redirect(longURL);
});



// -------------------------POSTS -----------------------------
app.post("/login", (req, res) => {//update to acct urls_login
  for (let user in users) {

    if (users[user].email === req.body.email) {
      console.log("that email is already registered!");//tst
      if (users[user].password !== req.body.password) {
        console.log("Password does not match!");//tst
        return res.status(403).send("Password mismatch");
      } else {
        console.log(users[user].id);
        console.log(user);
        req.session.user_id = users[user].id;
        res.redirect("/urls");
        return;
      }
    } 
  }
  return res.status(403);
});

app.post("/register", (req, res) => {//register page
  console.log(users);//tst show DB before
  
  if (!req.body.email || !req.body.password) {
    console.log('no email, no pass given');//tst 
    return res.status(400).send("no email or pass provided");
  } 
  
  if (checkEmail(users, req)) {
    console.log("that email is already registered!");//tst
    return res.statusCode = 400;
  }

  const userId = generateRandomString();
  users[userId] = {
    id: userId, 
    email: req.body.email,
    password: req.body.password
  };

  res.cookie('user_id', `${userId}`);//try userId without backtics
  //or req.cookies['user_id']
  
  // console.log(users);//tst
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {//COOKIE
  req.session = null;
  // res.clearCookie('user_id', req.session.user_id);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  // console.log(req.body);  // Log the POST request body to the console
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  // console.log(urlDatabase);
  console.log(urlDatabase);//tst
  res.redirect(`/urls/${shortURL}`);
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id", (req, res) => {//update
  urlDatabase[req.params.id] = { longURL: req.body.longURL, userID: req.session.user_id };
  // console.log(urlDatabase);//tst
  res.redirect("/urls/:shortURL"); //this route res.renders "urls_show"
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

