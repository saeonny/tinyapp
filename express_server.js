const express = require("express");
const app = express();
const PORT = 8080; // default port 8080


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//run http://localhost:8080/ this is the home route
app.get("/", (req, res) => {
  res.send("Hello!"); //send simple string
});


//http://localhost:8080/urls.json 
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); // send json
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});