const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

// ** User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have a valid email.'],
    unique: true,
    lowerCase: true,
    validator: [validator.isEmail, 'Please provide a valid email.'],
  },
  photo: {
    type: String,
    default:
      'https://tour-management-system-8edf.onrender.com/public/img/default.jpg',
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A user must have a password.'],
    minLength: [8, 'A password must have more or equal to 8 characters.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    select: false,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same. Please verify passwords.',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// ** Encrypt Password (Middleware)
userSchema.pre('save', async function (next) {
  // will only run if the password was actually modified
  if (!this.isModified('password')) return next();

  // Encrypt/Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete the confirmPassword field from the DB
  this.passwordConfirm = undefined;

  // Call the next middleware
  next();
});

// ** Point to the current query (Middleware)
userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  this.select('-__v');
  next();
});

// ** Make sure that the token is created before time-stamp (Middleware)
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// ** Check if passwords match (Method)
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// ** Check if the user has changed password after getting the token (Method)
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // Check if user changed password after the token was issued
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

// ** Create random token in order to reset password (Method)
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 600000; // +10 min from now

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
