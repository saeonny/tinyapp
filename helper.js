const bcrypt = require('bcryptjs');

const users = {
  "admin1": {
    id: "admin1",
    email: "admin1@mail.com",
    password: bcrypt.hashSync("1234", 10),
  },
  "admin2": {
    id: "admin2",
    email: "admin2@mail.com",
    password: bcrypt.hashSync("1234", 10),
  }
};

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "admin1"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "admin2"
  },


};

const generateRandomString = function() {
  let random = Math.random().toString(20).substr(2, 6);
  const keys = Object.keys(urlDatabase);
  while (keys.indexOf(random) !== -1) {  // while random string does not exists in the urlDatabase
    random = Math.random().toString(20).substr(2, 6);
  }
  return random;

};

const registeredEmails = function() {
  let emails = [];
  for (let id in users) {
    emails.push(users[id].email);
  }
  return emails;
};


const loginCheck = function(email, password) {
  for (let id in users) {
    if (users[id].email === email && bcrypt.compareSync(password, users[id].password)) {
      return id;

    }
  }
  return undefined;
};

//
const findRegisteredURL = function(user_id) {
  let urls = {};
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === user_id) {
      urls[shortURL] = urlDatabase[shortURL].longURL;
    }

  }
  return urls;
};

const getShortURL = function(user_id) {
  let shortURLs = [];
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === user_id) {
      shortURLs.push(shortURL);
    }
  }
  return shortURLs;
};



module.exports = {users,urlDatabase,generateRandomString,registeredEmails,loginCheck,findRegisteredURL,getShortURL};