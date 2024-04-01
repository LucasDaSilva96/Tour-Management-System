const mongoose = require('mongoose');
const { dateCheckFunc } = require('../utils/dateValidation');

const bookingSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: [true, 'A tour must have a name.'],
  },
  tourDate: {
    type: Date,
    required: [true, 'A tour must have a date.'],
    validate: {
      validator: function (el) {
        console.log(el);
        return dateCheckFunc(el) > -1;
      },
      message: 'A tour must take place in the present or future.',
    },
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
  notes: String,
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

const tourSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Enter a year for the bookings.'],
    unique: true,
  },
  bookings: [bookingSchema], // Add array of bookings
});

const Tour = mongoose.model('tour', tourSchema);

module.exports = Tour;
