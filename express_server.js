const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
//refresh => StatusCode 304

app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/urls", (req, res) => {
  const templateVars = {urls : urlDatabase};
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

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});



//this is the format "/urls/:shortURL" and req.params.shortURL return shortURL which indicated by :
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]} ;
  res.render("urls_show", templateVars);
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
  res.send("Hello!"); //send simple string
});


//http://localhost:8080/urls.json 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // send json
});

//http://localhost:8080/hello
// curl http://localhost:8080/hello => Content-Type: text/html
app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});