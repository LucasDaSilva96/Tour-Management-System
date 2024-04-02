const { Guide } = require('../models/guideModel');
const { Tour } = require('../models/tourModel');
const { responseHelper } = require('../utils/httpResponse');

// ? Helper function to check if the booking has a valid year
const isValidYear = (date) => {
  const currentYear = new Date().getFullYear();
  const providedYear = new Date(date).toISOString().split('-')[0];
  if (Number(providedYear) < currentYear) {
    return false;
  } else {
    return true;
  }
};

// ** The create booking Middleware
exports.createTour = async (req, res, next) => {
  try {
    let { tourDate } = req.body;

    if (!tourDate) throw new Error('A tour must have a date.');
    if (isValidYear(tourDate) === false)
      throw new Error('A booking must take place in the present or future.');
    const period = await Tour.findOne({
      year: Number(tourDate.toString().split('-')[0]),
    });

    if (!period)
      throw new Error('The document for the provided year is not yet created');
    tourDate = new Date(req.body.tourDate);
    const timeIsTaken = period.bookings.find((el) => {
      return el.tourDate.toISOString() === tourDate.toISOString();
    });

    if (timeIsTaken)
      throw new Error(
        'You already have a booking on the provided day and time.'
      );

    period.bookings.push({ ...req.body });

    await period.save();

    responseHelper(201, 'Tour successfully created', res, period.bookings);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** This Middleware is in charge of creating tours document automatic
exports.createYearDocument = async (req, res, next) => {
  try {
    const docs = await Tour.find();
    const docsYearsArray = docs.map((el) => Number(el.year));
    const targetYear = new Date().getFullYear() + 2;

    const yearFound = () => {
      return docsYearsArray.findIndex((el) => el === targetYear) > -1
        ? true
        : false;
    };

    let index = 1;
    if (yearFound(1) === false) {
      while (yearFound() === false) {
        docsYearsArray.push(new Date().getFullYear() + index);
        await Tour.create({
          year: new Date().getFullYear() + index,
          bookings: [],
        });
        index++;
      }
    }

    next();
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** This Middleware is for assigning a booking to a guide
exports.assignGuideToBooking = async (req, res, next) => {
  try {
    const { bookingID, guide, year } = req.query;
    if (!bookingID || !guide || !year)
      throw new Error('Please selected a tour,guide & year.');

    const doc = await Tour.findOne({ year: Number(year) });
    if (!doc) throw new Error('No collection found with the provided year.');

    const guideDoc = await Guide.findOne({ email: guide });
    if (!guideDoc)
      throw new Error('No guide found with the provided guide-email.');

    const booking = doc.bookings.find((el) => el.id === bookingID);
    if (!booking)
      throw new Error('No booking found with the provided bookingID.');

    const guideBookingsYearDoc = guideDoc.guide_bookings.find(
      (el) => el.year === Number(year)
    );
    if (!guideBookingsYearDoc && Number(year) >= new Date().getFullYear()) {
      guideDoc.guide_bookings.push({
        year: Number(year),
        bookings: [],
      });
    }

    booking.guide = guideDoc._id;
    guideDoc.guide_bookings
      .find((el) => el.year === Number(year))
      .bookings.push(booking);

    await guideDoc.save();
    await doc.save();

    responseHelper(200, 'Guide successfully assigned to guide.', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** Update booking status Middleware
exports.changeBookingStatus = async (req, res, next) => {
  try {
    const { bookingID, year, status } = req.query;
    if (!bookingID || !year || !status)
      throw new Error('Please provide bookingID, year and status.');

    const tourDoc = await Tour.findOne({ year: Number(year) });
    if (!tourDoc) throw new Error('No tour document found.');

    const BOOKING = tourDoc.bookings.find((el) => el.id === bookingID);
    if (!BOOKING) throw new Error('No booking found with the provided id');

    BOOKING.status = status;

    const guides = await Guide.find();
    let index = 0;

    // Iterate through each guide
    for (const guide of guides) {
      // Iterate through each guide booking for the guide
      for (const guideBooking of guide.guide_bookings) {
        // Search for the booking with the provided bookingID
        const booking = guideBooking.bookings.find(
          (book) => book.id === bookingID
        );

        if (booking) {
          booking.status = status;
          await guide.save();
          break;
        }
        index++;
        if (index === guides.length) break;
      }
      if (index === guides.length) break;
    }

    await tourDoc.save();

    responseHelper(200, 'Booking status successfully updated', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};
