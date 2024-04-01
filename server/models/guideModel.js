const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'A guide must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A guide must have a email.'],
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
    default: '/img/default.jpg',
  },
  tour: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'tours',
    },
  ],
  updatedAt: Date,
  updatedBy: String,
});

// ** Only show guides that are currently working(active) &
// ** hide the __v + active fields Middleware
guideSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  this.select(['-__v', '-active']);
  next();
});

const Guide = mongoose.model('guide', guideSchema);
module.exports = Guide;
