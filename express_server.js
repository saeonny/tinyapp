
const PORT = 8080; // default port 8080
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const { redirect, header } = require("express/lib/response");
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(cookieSession({
  name : 'session',
  keys: ["key1","key2"],
  
}))

app.set("view engine", "ejs");

let loginTry_noMatch = false;
let loginTry_noEmail = false;
let createTry = false;
let registerTry_invID = false;
let registerTry_exist = false;
///////////////////////////////DATA/////////////////////////////////////////////////////
const users = {
  // "userRandomID": {
  //   id: "userRandomID",
  //   email: "user@example.com",
    
  // },
  // "user2RandomID": {
  //   id: "user2RandomID",
  //   email: "user2@example.com",
    
  // }
}


// users.userRandomID.password = bcrypt.hashSync("purple-monkey-dinosaur",10);
// users.user2RandomID.password = bcrypt.hashSync("dishwasher-funk",10);


const urlDatabase = {
  // "b2xVn2": {
  //   longURL: "http://www.lighthouselabs.ca",
  //   userID: "userRandomID"
  // },
  // "9sm5xK": {
  //   longURL: "http://www.google.com",
  //   userID: "userRandomID"
  // }
};

///////////////////////////////INITIALIZING /HOME PAGE//////////////////
app.get("/urls", (req, res) => {
  const templateVars = { urls: null, user_id: null, email: null };
  if (req.session.user_id) {
    templateVars.urls = findRegisteredURL(req.session.user_id);
    templateVars.user_id = req.session.user_id
   // templateVars.email = users[req.session.user_id].email
   console.log(req.session.user_id)
   templateVars.email = users[req.session.user_id].email
  }

  res.render("urls_index", templateVars);

})

app.post("/urls", (req, res) => {
  let recievedLongUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = { longURL: recievedLongUrl, userID: req.session.user_id }
  res.redirect("/urls")

});


/////////////////////REGISTER////////////////////////////////////////////////////////
app.get("/register", (req, res) => {
  const templateVars = { user_id: null, email: null, registerTry_exist: registerTry_exist, registerTry_invID: registerTry_invID };
  res.render("urls_register", templateVars)

})
app.post("/registerbt", (req, res) => {
  res.redirect("/register")
})
app.post("/register", (req, res) => {
  let email = req.body.email;
  let emails = registeredEmails();
  if (emails.indexOf(email) !== -1) {
    res.status(400);
    registerTry_exist = true;
    registerTry_invID = false;
    return res.redirect("/register")
  }
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    registerTry_exist = false;
    registerTry_invID = true;
    return res.redirect("/register")

  }
  else {
    registerTry_exist = false;
    registerTry_invID = false;
    let id = generateRandomString();
    while (Object.keys(users).indexOf(id) !== -1) {
      id = generateRandomString();
    }
    users[id] = { id: id, email: req.body.email, password: bcrypt.hashSync(req.body.password,10) };
    console.log(users);
    req.session.user_id = id;
    res.redirect("/urls")
  }

})


app.get("/u/:shortURL", (req, res) => {

  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  //if shortURL is not exists
  if (!longURL) {
    res.send(`no such shortURL: ${shortURL} exists`);
  }
  res.redirect(longURL);

});

app.post("/urls/:shortURL/delete", (req, res) => {
  const short = req.params.shortURL;
  delete urlDatabase[short];
  res.redirect("/urls");


});


////LOGIN////////////////////////////////////////////

app.get("/login", (req, res) => {
  loginTry_noEmail = false;
  oginTry_noMatch = false
  const templateVars = { user_id: null, email: null, loginTry_noEmail: loginTry_noEmail, loginTry_noMatch: loginTry_noMatch, createTry: createTry };

  if (req.session.user_id !== undefined) {
    templateVars.user_id = req.session.user_id
    templateVars.email = users[req.session.user_id].email
  }


  res.render("urls_login", templateVars);

})


app.post("/login", (req, res) => {
  //res.cookie("user_id", req.body.username)
  createTry = false;
  loginTry_noEmail = false;
  loginTry_noMatch = false;

  res.redirect("/login");

})

app.post("/logintry", (req, res) => {
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
      if (! bcrypt.compareSync(givenPass, users[id].password)) {
        res.status(403);
        loginTry_noMatch = true;
        const templateVars = { user_id: null, email: null, loginTry_noEmail: loginTry_noEmail, loginTry_noMatch: loginTry_noMatch, createTry: createTry };
        return res.render("urls_login", templateVars)
      }
    }
  }

  loginTry_noEmail = true;
  loginTry_noMatch = false;
  createTry = false;
  res.status(403);
  const templateVars = { user_id: null, email: null, loginTry_noEmail: loginTry_noEmail, loginTry_noMatch: loginTry_noMatch, createTry: createTry };
  res.render("urls_login", templateVars);



})

app.post("/logout", (req, res) => {
  //res.clearCookie("user_id");
  req.session = null;
  res.redirect("/urls")

})







app.post("/urls/:shortURL/edit", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);

});

app.post("/urls/:shortURL/editted", (req, res) => {
  let editedURL = req.body.edittedURL;
  urlDatabase[req.params.shortURL].longURL = editedURL;

  res.redirect('/urls')


});

app.get("/urls/new", (req, res) => {
  const templateVars = { user_id: null, email: null };
  if (req.session.user_id) {
    templateVars.user_id = req.session.user_id
    templateVars.email = users[req.session.user_id].email
    res.render("urls_new", templateVars);
  }
  if (!req.session.user_id) {
    createTry = true;
    res.redirect("/login");
  }

});



//this is the format "/urls/:shortURL" and req.params.shortURL return shortURL which indicated by :
app.get("/urls/:shortURL", (req, res) => {
  if (req.session.user_id) {
    if (getShortURL(req.session.user_id).indexOf(req.params.shortURL) !== -1) {
      const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: null };
      templateVars.user_id = req.session.user_id
      templateVars.longURL = urlDatabase[req.params.shortURL].longURL;
      templateVars.email = users[req.session.user_id].email;
      return res.render("urls_show", templateVars);
    }
    return res.send("You cant access this way");
  }
  return res.send("You should login to use this feature");

});

app.post("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
});


function generateRandomString() {
  let random = Math.random().toString(20).substr(2, 6);
  const keys = Object.keys(urlDatabase);
  while (keys.indexOf(random) !== -1) {  // while random string does not exists in the urlDatabase
    random = Math.random().toString(20).substr(2, 6);
  }
  return random;

}

function registeredEmails() {
  let emails = []
  for (let id in users) {
    emails.push(users[id].email)
  }
  return emails;
}

//using bycryp
function loginCheck(email, password) {
  for (let id in users) {
    if (users[id].email === email && bcrypt.compareSync(password, users[id].password)) {
      return id;

    }
  }
  return undefined;
}

function findRegisteredURL(user) {
  let urls = {}
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === user) {
      urls[shortURL] = urlDatabase[shortURL].longURL;
    }

  }
  return urls
}

function getShortURL(user) {
  let shortURLs = [];
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === user) {
      shortURLs.push(shortURL);
    }
  }
  return shortURLs
}




app.listen(PORT, () => {
  console.log(`Tiny APP listening on port ${PORT}!`);
});