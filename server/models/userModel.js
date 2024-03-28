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
    default: 'default.jpg',
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
