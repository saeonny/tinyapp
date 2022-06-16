const { assert } = require('chai');

const {generateRandomString,registeredEmails,loginCheck,findRegisteredURL,getShortURL} = require('../helper');



describe('registeredEmails() : should return all registered emails', function() {
  it('returns list of registred emails', function() {
    const emails = registeredEmails()
    const expected= ["user@example.com","user2@example.com" ];
    assert.deepEqual(emails, expected);
  });
});

describe('findRegisteredURL(user_id) : should return all shortURL : longURL that user_id registered as object', function() {
  it('object}', function() {
    const output = findRegisteredURL("userRandomID")
    const expected= {"b2xVn2" : "http://www.lighthouselabs.ca","9sm5xK":"http://www.google.com"};
    assert.deepEqual(output, expected);
  });
});

describe('getShortURL(user_id) : should return all shortURL that user_id registered as array', function() {
  it('object}', function() {
    const output = getShortURL("userRandomID")
    const expected= ["b2xVn2","9sm5xK"];
    assert.deepEqual(output, expected);
  });
});


