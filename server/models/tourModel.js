const mongoose = require('mongoose');
const { dateCheckFunc } = require('../utils/dateValidation');

const bookingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A booking must have a name.'],
  },
  start: {
    type: Date,
    required: [true, 'A booking must have a date.'],
    validate: {
      validator: function (el) {
        return dateCheckFunc(el) > -1;
      },
      message: 'A booking must take place in the present or future.',
    },
  },
  end: {
    type: Date,
    required: [true, 'A tour must have a end date.'],
  },
  guide: {
    type: mongoose.Schema.ObjectId,
    ref: 'guides',
  },
  status: {
    type: String,
    enum: ['preliminary', 'confirmed', 'cancelled'],
    default: 'preliminary',
  },
  color: {
    type: String,
    default: 'yellow',
    enum: ['yellow', 'green', 'red'],
  },
  textColor: {
    type: String,
    default: 'black',
  },
  description: String,
  contactPerson: {
    type: String,
    required: [true, 'A booking must have a contact person'],
  },
  contactEmail: {
    type: String,
  },
  contactPhone: String,
  participants: {
    type: Number,
    required: [true, 'Please enter the number of participants.'],
    min: [1, 'The number of participants must be at least 1.'],
  },
});

bookingSchema.index({ groupName: 1, tourDate: 1 });

bookingSchema.pre('save', function (next) {
  if (!this.contactEmail && !this.contactPhone) {
    throw new Error(
      'A booking must have either a phone number or email to the person in charge of the reservation.'
    );
  } else {
    next();
  }
});

exports.bookingSchema = bookingSchema;

const tourSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Enter a year for the bookings.'],
    unique: true,
  },
  bookings: [bookingSchema], // Add array of bookings
});

exports.Tour = mongoose.model('tour', tourSchema);
