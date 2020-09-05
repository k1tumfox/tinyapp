const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { checkEmail, getUserByEmail } = require('./helpers/checkEmails');

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

const urlsForUser = function(id) {
  const userUrls = {}
  for (let short in urlDatabase) {
    if (urlDatabase[short].userID === id) {
      userUrls[short] = { longURL: urlDatabase[short].longURL, userID: urlDatabase[short].userID };
    }
  }
  return userUrls;
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
      urls: urlsForUser(req.session['user_id'])  // formerly urlDatabase 
    };
    res.render("urls_index", templateVars);
  }
});

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

app.get("/urls/:shortURL", (req, res) => {  //to go tiny page if it exists
  // console.log("shortURL is:", req.params.shortURL); //:9sm5xK
  let templateVars = { 
    // username: req.cookies["username"],
    user: users[req.session['user_id']],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL //FIX 9:10PM --------
  };
  res.render("urls_show", templateVars); 
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  console.log("longURL", longURL);
  res.redirect(longURL);
});

app.get("/whoops", (req, res) => {
  res.send("You can't do that.");
});

// -------------------------POSTS -----------------------------

app.post("/login", (req, res) => {//update to acct urls_login
  const cUser = getUsersByEmail(req.body.email, users, req.body.password);//fcn call
  if (!cUser) {
    return res.status(403).send("That email is already registered, or password mismatch");
  } else {
    req.session.user_id = users[cUser].id;
    res.redirect("/urls");
  }
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

  const pw = req.body.password;  //bcrypting password before placing in database
  const hashpw = bcrypt.hashSync(pw, 10);

  const userId = generateRandomString();
  users[userId] = {
    id: userId, 
    email: req.body.email,
    password: hashpw
  };
  console.log(users[userId]); //tst

  // res.cookie('user_id', `${userId}`);
  req.session.user_id = userId;
  
  // console.log(users);//tst
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {//COOKIE
  req.session = null;
  // res.clearCookie('user_id', req.session.user_id);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => { //new
  const shortURL = generateRandomString();
  // console.log(req.body);  // Log the POST request body to the console
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  // console.log(urlDatabase);
  console.log(urlDatabase);//tst
  res.redirect(`/urls/${shortURL}`);
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id", (req, res) => {//update long URL
  // console.log(req.session.user_id); //userRandomID
  // console.log(req.params.id); //9sm5xK
  if (users[req.session.user_id].id === urlDatabase[req.params.id].userID) {
    urlDatabase[req.params.id] = { longURL: req.body.longURL, userID: req.session.user_id };
    console.log("redirecting to ", `/urls/:${req.params.id}`);// /urls/:9sm5xK
    res.redirect(`/urls/${req.params.id}`); //this route res.renders "urls_show"
  } else {
    res.redirect("/whoops");
  }

});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (users[req.session.user_id].id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  } else {
    res.redirect("/whoops");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

