const { UserInputError } = require('apollo-server');
const isEmail = require('validator/lib/isEmail');
const isLength = require('validator/lib/isLength');

const ValidateFields =  (email, password ) =>  {
  if (!isEmail(email)) {
    throw new UserInputError('Incorrect email format! :cry:');
  }
  if (password) {
    if (!isLength(password, 8)) {
      throw new UserInputError('Password cannot be less than 8 characters! :cry:');
    }
  }
};

module.exports = ValidateFields;
