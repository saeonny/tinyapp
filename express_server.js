const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

//// visit set then fetch => if we run fetch a is undefined
//http://localhost:8080/set
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
//http://localhost:8080/fetch
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});