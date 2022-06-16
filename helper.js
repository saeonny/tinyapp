
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "userRandomID"
  }
};

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


module.exports = {generateRandomString,registeredEmails,loginCheck,findRegisteredURL,getShortURL};