const { assert } = require('chai');


const {generateRandomString,registeredEmails,loginCheck,findRegisteredURL,getShortURL} = require('../helper');




describe('registeredEmails() : should return all registered emails', function() {
  it('', function() {
    const emails = registeredEmails();
    const expected = ["admin1@mail.com", "admin2@mail.com" ];
    assert.deepEqual(emails, expected);
  });
});

describe('findRegisteredURL(user_id) : should return all shortURL : longURL that user_id registered as object', function() {
  it('', function() {
    const output = findRegisteredURL("admin1");
    const expected = {"b2xVn2" : "http://www.lighthouselabs.ca"};
    assert.deepEqual(output, expected);
  });
});

describe('getShortURL(user_id) : should return all shortURL that user_id registered as array', function() {
  it('', function() {
    const output = getShortURL("admin2");
    const expected = ["9sm5xK"];
    assert.deepEqual(output, expected);
  });
});

describe('loginChceck(email, password): if password(using bycryp) and email matchs return its user_id otherwise return undefined ', function() {
  it('email exist but password not match return undefined', function() {
    const email = "admin1@mail.com";
    const password = "wrong";
    const output =  loginCheck(email,password);
    const expected = undefined;

    assert.deepEqual(output, expected);
  });

  it('email does not exists return undefined', function() {
    const email = "nahh@mail.com";
    const password = "wrong";
    const output =  loginCheck(email,password);
    const expected = undefined;

    assert.deepEqual(output, expected);
  });
  it('email and password matchs return user_id', function() {
    const email = "admin1@mail.com";
    const password = "1234";
    const output =  loginCheck(email,password);
    const expected = "admin1";

    assert.deepEqual(output, expected);
  });
});


