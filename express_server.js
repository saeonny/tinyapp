
const PORT = 8080; // default port 8080
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { redirect, header } = require("express/lib/response");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");
///////////////////////////////DATA/////////////////////////////////////////////////////

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

///////////////////////////////INITIALIZING /HOME PAGE//////////////////
app.get("/urls", (req, res) => {
  const templateVars = {urls : urlDatabase, id: null};
  if(req.cookies.username){
    templateVars.id = req.cookies.username
  }
  res.render("urls_index",templateVars);
  
})

app.post("/urls", (req, res) => {
  let recievedLongUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = recievedLongUrl;
  res.send("Ok");  
          
});

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
app.post("/login", (req, res)=> {
  let templateVars = {user :req.body.username };
  res.cookie("username", req.body.username)
  
  res.redirect("/urls");
  
})

app.post("/logout",(req,res)=>{
  res.clearCookie("username");
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
  const templateVars = {id : null};
  res.render("urls_new",templateVars);
});



//this is the format "/urls/:shortURL" and req.params.shortURL return shortURL which indicated by :
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], id : null} ;
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




//// app.get(path, (req,res) => {})
//run http://localhost:8080/ this is the home route
app.get("/", (req, res) => {
  
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});