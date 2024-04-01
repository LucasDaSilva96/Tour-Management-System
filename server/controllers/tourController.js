const Tour = require('../models/tourModel');
const { responseHelper } = require('../utils/httpResponse');

exports.createTour = async (req, res, next) => {
  try {
    if (!req.body.tourDate) throw new Error('A tour must have a date.');
    const period = await Tour.findOne({ year: req.body.year });

    if (!period)
      throw new Error(
        'The collection for the provided year is not yet created'
      );

    responseHelper(201, 'Tour successfully created', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};
