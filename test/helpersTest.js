const { assert } = require('chai');
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('../helpers/helpers.js');

const p1 = "purple-monkey-dinosaur"; // found in the req.params object
const hashedP1 = bcrypt.hashSync(p1, 10);
const p2 = "dishwasher-funk"; // found in the req.params object
const hashedP2 = bcrypt.hashSync(p2, 10);

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: hashedP1
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: hashedP2
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers, p1)
    const expectedOutput = testUsers.userRandomID;
    assert.deepEqual(user, expectedOutput);
  });
  it('if email is not in database, it should return undefined', function () {
    const actual = getUserByEmail("magic@man.com", testUsers, p1);
    const expected = undefined;
    assert.equal(actual, expected);
  });
});