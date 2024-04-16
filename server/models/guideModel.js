const mongoose = require('mongoose');
const { bookingSchema } = require('./tourModel');

const guideBookingSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: [
      true,
      'Enter a valid year to store the booking to the guide document',
    ],
  },
  bookings: [bookingSchema],
});

exports.guideBookingSchema = guideBookingSchema;

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
    // TODO Update the url
    default: 'http://localhost:8000/public/img/default.jpg',
  },
  updatedAt: Date,
  updatedBy: String,
  guide_bookings: [guideBookingSchema],
});

guideSchema.index({ email: 1 });

// ** Only show guides that are currently working(active) &
// ** hide the __v + active fields Middleware
guideSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  this.select(['-__v', '-active']);
  next();
});

exports.Guide = mongoose.model('guide', guideSchema);
