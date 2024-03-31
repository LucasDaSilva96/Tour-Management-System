const mongoose = require('mongoose');
const { dateCheckFunc } = require('../utils/dateValidation');

const tourSchema = new mongoose.Schema({
  tours: [
    {
      groupName: {
        type: String,
        required: [true, 'A tour must have a name.'],
      },
      tourDate: {
        type: Date,
        required: [true, 'A tour must have a date.'],
        validate: {
          validator: function (el) {
            return dateCheckFunc(el) > -1;
          },
          message: 'A tour must take place in the preset or future.',
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
      size: {
        type: Number,
        required: [true, 'Please enter the size of the tour.'],
        validate: {
          validator: function (el) {
            return el > 0;
          },
          message: 'The tour size cant be less then 1.',
        },
      },
    },
  ],
});

const Tour = mongoose.model('tour', tourSchema);

module.exports = Tour;
