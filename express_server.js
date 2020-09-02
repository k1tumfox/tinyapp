const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));//shows every route
app.use(cookieParser());

function generateRandomString() {
  return Math.random().toString(36).substring(2,8);
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
});
//When sending variables to an EJS template, they must be sent
//inside an object, so that we can use the key of that variable
//to access the data within our template.

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {  
  let templateVars = { 
    username: req.cookies["username"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL] 
  };
  res.render("urls_show", templateVars); 
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//added route/endpoint
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
 
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

//added route/endpoint to access JSON string rep urlDatabase object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
// POSTS ------------------------------------------
app.post("/login", (req, res) => {//COOKIE
  res.cookie('username', `${req.body.username}`);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {//COOKIE
  res.clearCookie('username', `${req.body.username}`);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  // console.log(req.body);  // Log the POST request body to the console
  urlDatabase[shortURL] = req.body.longURL;
  // console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id", (req, res) => {//update
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls/:shortURL"); //this route res.renders "urls_show"
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

