const User = require('../models/userModel');
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

// *? Helper functions
// This function is in charge of the response-status and message
const authResponseHelper = (statusCode, message, data, res) => {
  let status;
  switch (statusCode) {
    case 401:
      status = 'fail';
      break;
    case 200:
      status = 'success';
    default:
      status = 'fail';
      break;
  }
  if (!data) {
    res.status(statusCode).json({
      status,
      message: message,
    });
  } else {
    res.status(statusCode).json({
      status,
      message: message,
      data: {
        data,
      },
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check if email and password is provided
    if (!email || !password) {
      authResponseHelper(401, 'Please enter your email and password.', res);
      return next();
    }
    // Check if the user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      authResponseHelper(
        401,
        'The provided user was not found. Please verify your credentials.',
        res
      );
      return next();
    }
    // Check if the provided password is equal to the password in the DB
    const correct = await user.correctPassword(password, user.password);
    if (!correct) {
      authResponseHelper(
        401,
        'Wrong password. Please verify your password.',
        res
      );
      return next();
    }
  } catch (err) {
    authResponseHelper(401, `${err.message}`, res);
  }
};
