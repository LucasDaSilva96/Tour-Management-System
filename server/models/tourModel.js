const mongoose = require('mongoose');
const { dateCheckFunc } = require('../utils/dateValidation');
const { uuid } = require('uuidv4');

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
    ref: 'guide',
  },
  status: {
    type: String,
    enum: ['preliminary', 'confirmed', 'cancelled'],
    default: 'preliminary',
  },
  color: {
    type: String,
    default: '#ffc300',
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
  snacks: {
    type: Boolean,
    default: false,
  },
  uuid: {
    type: String,
    default: uuid(),
    unique: [true, 'Please provide a unique uuid-string.'],
  },
});

bookingSchema.index({ title: 1, start: 1, uuid: 1 });

bookingSchema.pre('save', function (next) {
  if (!this.contactEmail && !this.contactPhone) {
    throw new Error(
      'A booking must have either a phone number or a email to the person in charge of the reservation.'
    );
  } else {
    next();
  }
});

// Middleware to validate end date
bookingSchema.pre('save', function (next) {
  if (this.isModified('end') && this.start >= this.end) {
    return next(new Error('End date must be after start date.'));
  }
  next();
});

// Middleware to automatically populate the guide field
bookingSchema.pre(/^find/, function (next) {
  // 'this' points to the current query
  this.populate({
    path: 'guide',
    select: 'fullName email phone photo', // Specify the fields you want to populate
  });
  next();
});

const tourSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: [true, 'Enter a year for the bookings.'],
    unique: true,
  },
  bookings: [bookingSchema], // Add array of bookings
});

tourSchema.index({ year: 1 });

exports.bookingSchema = bookingSchema;
exports.Bookings = mongoose.model('bookings', bookingSchema);

exports.Tour = mongoose.model('tour', tourSchema);
