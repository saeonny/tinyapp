const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/urls", (req, res) => {
  const templateVars = {urls : urlDatabase};
  res.render("urls_index",templateVars);
})

//this is the format "/urls/:shortURL" and req.params.shortURL return shortURL which indicated by :
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]} ;
  res.render("urls_show", templateVars);
});





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