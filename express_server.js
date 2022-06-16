
const PORT = 8080; // default port 8080
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { redirect, header } = require("express/lib/response");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

let logintry = false;
///////////////////////////////DATA/////////////////////////////////////////////////////
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

///////////////////////////////INITIALIZING /HOME PAGE//////////////////
app.get("/urls", (req, res) => {
  const templateVars = {urls : urlDatabase, user_id: null, email : null };
  if(req.cookies.user_id){
    templateVars.user_id = req.cookies.user_id
    templateVars.email = users[req.cookies.user_id].email
  }

  res.render("urls_index",templateVars);
  
})

app.post("/urls", (req, res) => {
  let recievedLongUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = recievedLongUrl;
  res.redirect("/urls")  
          
});


/////////////////////REGISTER////////////////////////////////////////////////////////
app.get("/register",(req, res) => {
  const templateVars = {user_id : null,email : null};
  res.render("urls_register",templateVars)

})
app.post("/registerbt", (req, res)=> {
  res.redirect("/register")
})
app.post("/register",(req, res)=> {
  let email = req.body.email;
  let emails = registeredEmails();
  if(emails.indexOf(email) !== -1){
    res.status(400);
    return res.send("StatusCode"+res.statusCode+": already registered email try again")
  }
  if(req.body.email === "" || req.body.password === "") {
    res.status(400);
    return res.send("statusCode"+res.statusCode+" :Invalid email and password try again")

  }
  else {
    let id = generateRandomString();
    while(Object.keys(users).indexOf(id) !== -1) {
      id = generateRandomString();
    }
    users[id] = {id : id,email : req.body.email, password : req.body.password};
    console.log(users);
    res.cookie("user_id",id);
    res.redirect("/urls")
  }

}) 


app.get("/u/:shortURL", (req, res) => {
  
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  //if shortURL is not exists
  if(!longURL) {
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

app.get("/login",(req, res)=> {
  logintry = false;
  const templateVars = { user_id: null, email : null ,logintry : logintry};

  if(req.cookies.user_id !== undefined){
    templateVars.user_id = req.cookies.user_id
    templateVars.email = users[req.cookies.user_id].email
  }

  res.render("urls_login",templateVars);

})


app.post("/login", (req, res)=> {
  //res.cookie("user_id", req.body.username)
  res.redirect("/login");
  
})

app.post("/logintry", (req, res) => {
  let givenId = req.body.email;
  let givenPass = req.body.password;
  logintry = false;
  if(loginCheck(givenId,givenPass)){
    res.cookie("user_id", loginCheck(givenId,givenPass))
    return res.redirect("/urls");
  }else{
    logintry = true
    const templateVars = { user_id: null, email : null ,logintry : logintry};
    res.render("urls_login",templateVars);
  }


})

app.post("/logout",(req,res)=>{
  res.clearCookie("user_id");
  res.redirect("/urls")

})







app.post("/urls/:shortURL/edit", (req, res) => {
  res.redirect(`/urls/${req.params.shortURL}`);
          
});

app.post("/urls/:shortURL/editted", (req, res) => {
  let editedURL = req.body.edittedURL;
  urlDatabase[req.params.shortURL] = editedURL;

  res.redirect('/urls')

          
});

app.get("/urls/new", (req, res) => {
  const templateVars = {user_id : null,email : null};
  if(req.cookies.user_id){
    templateVars.user_id = req.cookies.user_id
    templateVars.email = users[req.cookies.user_id].email
  }
  res.render("urls_new",templateVars);
});



//this is the format "/urls/:shortURL" and req.params.shortURL return shortURL which indicated by :
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id : null} ;
  if(req.cookies.user_id){
    templateVars.user_id = req.cookies.user_id
    templateVars.email = users[req.cookies.user_id].email
  }
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const short = req.params.shortURL;
});


function generateRandomString() {
  let random = Math.random().toString(20).substr(2, 6);
  const keys = Object.keys(urlDatabase);
  while(keys.indexOf(random) !== -1){  // while random string does not exists in the urlDatabase
    random = Math.random().toString(20).substr(2, 6);
  }
  return random;

}

function registeredEmails() {
  let emails = []
  for(let id in users){
    emails.push(users[id].email)
  }
  return emails;
}

function loginCheck(email, password) {
  for(let id in users){
    if(users[id].email === email && users[id].password === password) {
      return id;
      
    }
  }
  return undefined;
}



//// app.get(path, (req,res) => {})
//run http://localhost:8080/ this is the home route
app.get("/", (req, res) => {
  
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});