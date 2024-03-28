const User = require('../models/userModel');
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

// *? Helper functions
// This function is in charge of the response-status and message
const responseHelper = (statusCode, message, res, data) => {
  let status;

  if (statusCode >= 200 && statusCode < 400) status = 'success';
  if (statusCode >= 400) status = 'fail';

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
exports.responseHelper = responseHelper;

// This function is in charge of generating the JWT(Token)
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    algorithm: 'HS256',
  });
};

// This function is in charge of sending the token to the browser/user
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  // In milliseconds ↓
  const expiryData = new Date(
    Date.now(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
  );

  const cookieOptions = {
    expire: expiryData,
    httOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// ** The log in Middleware
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if email and password is provided
    if (!email || !password) {
      responseHelper(401, 'Please enter your email and password.', res);
      return next();
    }
    // Check if the user with the provided email exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      responseHelper(
        401,
        'The provided user was not found. Please verify your credentials.',
        res
      );
      return next();
    }
    // Check if the provided password is equal to the password in the DB
    const correct = await user.correctPassword(password, user.password);
    if (!correct) {
      responseHelper(401, 'Wrong password. Please verify your password.', res);
      return next();
    }

    // Send the token if everything is correct
    createSendToken(user, 200, req, res);
  } catch (err) {
    responseHelper(401, `${err.message}`, res);
  }
};

// ** The sign up Middleware
exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, photo, role } = req.body;
    if (!name || !email || !password || !passwordConfirm) {
      throw new Error(
        'Please enter a name, email, password and confirm your password.'
      );
    }
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      photo: photo || undefined,
      role: role || undefined,
    });

    createSendToken(newUser, 201, req, res);
    // TODO Send welcome email to new users
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** The log out Middleware
exports.logOut = (req, res) => {
  req.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.clearCookie('jwt');
  responseHelper(200, 'Logged out', res);
};
