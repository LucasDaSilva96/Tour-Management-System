const User = require('../models/userModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendWelcomeMail, sendResetPasswordMail } = require('../utils/email');
const { responseHelper } = require('../utils/httpResponse');

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
      throw new Error('Please provided email and password.');
    }
    // Check if the user with the provided email exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new Error('no user found with the provided email.');
    }
    // Check if the provided password is equal to the password in the DB
    const correct = await user.correctPassword(password, user.password);
    if (!correct) {
      throw new Error('Wrong password. Please verify your password.');
    }

    // Send the token if everything is correct
    createSendToken(user, 200, req, res);
  } catch (err) {
    responseHelper(401, err.message, res);
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
    // Send welcome email to new users ↓
    await sendWelcomeMail(newUser);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** The log out Middleware
exports.logOut = (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.clearCookie('jwt');
  responseHelper(200, 'Logged out', res);
};

// ** The protect information Middleware
exports.protect = async (req, res, next) => {
  try {
    let token,
      decoded = undefined;
    // 1 Get the token and check if it's true
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      responseHelper(401, 'Please log in first.', res);
      return;
    }

    // 2 Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, deco) => {
      if (err) {
        responseHelper(401, err.message, res);
        return next();
      } else {
        decoded = deco;
      }
    });

    // 3 Check if the user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      responseHelper(
        401,
        'The user belonging to the token does not exist.',
        res
      );
      return;
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      responseHelper(
        401,
        'User recently changed password. Please log in again.',
        res
      );
      return;
    }

    // 4 grant access to the protected route
    req.user = currentUser;
    next();
  } catch (err) {
    responseHelper(401, err.message, res);
  }
};

// ** Generate resetToken for password and send email Middleware

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      throw new Error('No email provided. Please provide a valid email.');
    // 1 Get the user based on the email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('No user found with the provided email. Verify email.');
    }
    // 2 Generate random token
    const resetToken = user.createPasswordResetToken();
    const hashToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetToken = hashToken;
    await user.save();
    // 3) Send it back as email
    // TODO change reset url ↓
    const resetURL = `http://localhost:8000/api/v1/users/resetPassword/${resetToken}`;

    // TODO If the company wants to receive emails in order to reset password, change this ↓
    // await sendResetPasswordMail(user, resetURL);

    res.status(200).json({
      status: 'success',
      resetToken: hashToken,
    });
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** Reset password Middleware
exports.resetPassword = async (req, res, next) => {
  try {
    const { password, passwordConfirm } = req.body;
    // Get the user based on the token
    const user = await User.findOne({
      passwordResetToken: req.params.token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error('Token is invalid or has expired');

    // If token has not expired, and there is a user, set the password
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log the user in, Send JTW
    createSendToken(user, 200, req, res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};
