
const PORT = 8080; // default port 8080
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const { redirect, header } = require("express/lib/response");
const bcrypt = require('bcryptjs');
const {users,urlDatabase,generateRandomString,registeredEmails,loginCheck,findRegisteredURL,getShortURL} = require("./helper");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ["0"],

  maxAge: 24 * 60 * 60 * 1000

}));

app.set("view engine", "ejs");

let loginTry_noMatch = false;
let loginTry_noEmail = false;
let createTry = false;
let registerTry_invID = false;
let registerTry_exist = false;


///////////////////////////////INITIALIZING /HOME PAGE//////////////////

app.get("/", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  return res.redirect("/login");

});


app.get("/urls", (req, res) => {
  const templateVars = { urls: null, user_id: null, email: null };
  console.log("users", users);

  if (req.session.user_id) {
    templateVars.urls = findRegisteredURL(req.session.user_id);
    templateVars.user_id = req.session.user_id;
    
    templateVars.email = users[req.session.user_id].email;
  }

  res.render("urls_index", templateVars);

});


///////////////////CREATE NEW URL/////////////////////////////////////////////
app.get("/urls/new", (req, res) => {
  if (req.session.user_id) {
    const templateVars = {
      user_id: req.session.user_id,
      email: users[req.session.user_id].email
    };
    return res.render("urls_new", templateVars);
  }

  if (!req.session.user_id) {
    createTry = true;
    res.redirect("/login");
  }

});

app.post("/urls", (req, res) => {
  let recievedLongUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = { longURL: recievedLongUrl, userID: req.session.user_id };

  res.redirect("/urls");

});
/////////////////////////EDIT////////////////////////////////////////////

app.get("/urls/:shortURL", (req, res) => {

  const templateVars = {
    shortURL: null,
    longURL: null,
    user_id: null,
    email: null,
    newURLTry_noURL: false,
  };


  if (req.session.user_id) {
    if (getShortURL(req.session.user_id).indexOf(req.params.shortURL) !== -1) {
      templateVars.shortURL = req.params.shortURL;
      templateVars.longURL = urlDatabase[req.params.shortURL].longURL;
      templateVars.user_id = req.session.user_id;
      templateVars.email = users[req.session.user_id].email;
      return res.render("urls_show", templateVars);
    }
    templateVars.email = users[req.session.user_id].email;
    templateVars.shortURL = req.params.shortURL;
    templateVars.user_id = req.session.user_id;
    templateVars.newURLTry_noURL = true;
  }
  return res.render("urls_show", templateVars);
});



app.post("/urls/:shortURL", (req, res) => {
  let editedURL = req.body.edittedURL;
  urlDatabase[req.params.shortURL].longURL = editedURL;

  res.redirect('/urls');


});
////////////////////DELETE///////////////////////////////////////////////////

app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id) {
    if (getShortURL(req.session.user_id).indexOf(req.params.shortURL) !== -1) {
      const short = req.params.shortURL;
      delete urlDatabase[short];
      return res.redirect("/urls");
    }

    res.send("wrong shortURL... try again!");

  }

  return res.send("You cant access this way you should login first");



});

////////////////////DIRECT TO LONG URL USING SHORT URL/////////////////////////
app.get("/u/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL;

  if (!urlDatabase[shortURL]) {
    return res.send(`no such shortURL: ${shortURL} exists`);
  }
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);

});



app.get("/register", (req, res) => {
  const templateVars = { user_id: null, email: null, registerTry_exist: registerTry_exist, registerTry_invID: registerTry_invID };
  res.render("urls_register", templateVars);

});


//Creating NEw Account
app.post("/register", (req, res) => {
  let email = req.body.email;
  let emails = registeredEmails();


  if (emails.indexOf(email) !== -1) {

    res.status(400);
    registerTry_exist = true;
    registerTry_invID = false;
    return res.redirect("/register");
  }

  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    registerTry_exist = false;
    registerTry_invID = true;
    return res.redirect("/register");

  } else {
    registerTry_exist = false;
    registerTry_invID = false;
    let id = generateRandomString();
    while (Object.keys(users).indexOf(id) !== -1) {
      id = generateRandomString();
    }
    //regiter no matter
    req.session.user_id = id;
    users[id] = { id: id, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10) };
    console.log(users);


    return res.redirect("/urls");
  }

});





////LOGIN////////////////////////////////////////////

app.get("/login", (req, res) => {
  loginTry_noEmail = false;
  loginTry_noMatch = false;
  const templateVars = { user_id: null, email: null, loginTry_noEmail: loginTry_noEmail, loginTry_noMatch: loginTry_noMatch, createTry: createTry };

  if (req.session.user_id !== undefined) {
    templateVars.user_id = req.session.user_id;
    templateVars.email = users[req.session.user_id].email;
  }


  res.render("urls_login", templateVars);

});




app.post("/login", (req, res) => {
  createTry = false;
  let givenId = req.body.email;
  let givenPass = req.body.password;
  loginTry_noEmail = false;
  loginTry_noMatch = false;


  if (loginCheck(givenId, givenPass)) {
    // res.cookie("user_id", loginCheck(givenId, givenPass))
    req.session.user_id = loginCheck(givenId, givenPass);

    return res.redirect("/urls");
  }
  for (let id in users) {
    if (users[id].email === givenId) {
      if (!bcrypt.compareSync(givenPass, users[id].password)) {
        res.status(403);
        loginTry_noMatch = true;
        const templateVars = { user_id: null, email: null, loginTry_noEmail: loginTry_noEmail, loginTry_noMatch: loginTry_noMatch, createTry: createTry };
        return res.render("urls_login", templateVars);
      }
    }
  }

  loginTry_noEmail = true;
  loginTry_noMatch = false;
  createTry = false;
  res.status(403);
  const templateVars = { user_id: null, email: null, loginTry_noEmail: loginTry_noEmail, loginTry_noMatch: loginTry_noMatch, createTry: createTry };
  res.render("urls_login", templateVars);



});

app.post("/logout", (req, res) => {
  //res.clearCookie("user_id");
  req.session = null;

  res.redirect("/urls");

});








app.listen(PORT, () => {
  console.log(`Tiny APP listening on port ${PORT}!`);
});