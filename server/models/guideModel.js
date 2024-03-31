const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: [true, 'A guide must have a name'],
  },
  email: {
    type: String,
    lowercase: true,
    unique: [true, 'This email is already in the database'],
  },
  phone: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
  photo: {
    type: String,
    default: '../public/img/default.jpg',
  },
  tour: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'tours',
    },
  ],
});

const Guide = mongoose.model('guide', guideSchema);

module.exports = Guide;
