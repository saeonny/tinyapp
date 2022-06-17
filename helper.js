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
}

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "admin1"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "admin2"
  },
  "5sm2x4": {
    longURL: "http://www.youtube.com",
    userID: "admin2"
  },
  "4samx0": {
    longURL: "http://www.dfdsf.com",
    userID: "admin2"
  },

};

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

//using bycryp password
function loginCheck(email, password) {
  for (let id in users) {
    if (users[id].email === email && bcrypt.compareSync(password, users[id].password)) {
      return id;

    }
  }
  return undefined;
}

//
function findRegisteredURL(user_id) {
  let urls = {}
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === user_id) {
      urls[shortURL] = urlDatabase[shortURL].longURL;
    }

  }
  return urls
}

function getShortURL(user_id) {
  let shortURLs = [];
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === user_id) {
      shortURLs.push(shortURL);
    }
  }
  return shortURLs
}



module.exports = {users,urlDatabase,generateRandomString,registeredEmails,loginCheck,findRegisteredURL,getShortURL};