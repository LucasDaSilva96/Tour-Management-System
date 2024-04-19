const { Guide } = require('../models/guideModel');
const { Tour, Bookings } = require('../models/tourModel');
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
    let { start } = req.body;

    if (!start) throw new Error('A tour must have a date.');
    if (isValidYear(start) === false)
      throw new Error('A booking must take place in the present or future.');
    const period = await Tour.findOne({
      year: Number(start.toString().split('-')[0]),
    });

    if (!period)
      throw new Error('The document for the provided year is not yet created');
    start = new Date(req.body.start);
    const timeIsTaken = period.bookings.find((el) => {
      return el.start.toISOString() === start.toISOString();
    });

    if (timeIsTaken)
      throw new Error(
        'You already have a booking on the provided day and time.'
      );

    if (req.body.status) {
      const color =
        req.body.status === 'confirmed'
          ? '#2dc653'
          : req.body.status === 'cancelled'
          ? '#f21b3f'
          : '#ffc300';

      period.bookings.push({ ...req.body, color });
      await Bookings.create({ ...req.body, color });
    } else {
      period.bookings.push({ ...req.body });
      await Bookings.create({ ...req.body });
    }

    await period.save();

    responseHelper(201, 'Tour successfully created', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** This Middleware is in charge of creating tours document automatic
exports.createYearDocument = async (req, res, next) => {
  try {
    const tourDocs = await Tour.find();
    const guideDocs = await Guide.find({ active: true });

    const tourDocsYearArray = tourDocs.map((el) => Number(el.year));
    const targetYear = new Date().getFullYear() + 2;

    const yearFound = (docsYearsArray) => {
      return docsYearsArray.findIndex((el) => el === targetYear) > -1
        ? true
        : false;
    };

    // Tour
    let index = 1;
    if (yearFound(tourDocsYearArray) === false) {
      while (yearFound(tourDocsYearArray) === false) {
        tourDocsYearArray.push(new Date().getFullYear() + index);
        await Tour.create({
          year: new Date().getFullYear() + index,
          bookings: [],
        });
        index++;
      }
    }

    // Guide
    for (const guide of guideDocs) {
      if (!guide.guide_bookings.length > 0) {
        guide.guide_bookings.push(
          {
            year: new Date().getFullYear(),
            bookings: [],
          },
          {
            year: new Date().getFullYear() + 1,
            bookings: [],
          }
        );
        await guide.save();
      } else if (
        +guide.guide_bookings[guide.guide_bookings.length - 1].year <
        new Date().getFullYear() + 1
      ) {
        guide.guide_bookings.push({
          year: new Date().getFullYear() + 1,
          bookings: [],
        });
        await guide.save();
      }
    }

    next();
  } catch (err) {
    console.log('HERE 1');
    responseHelper(400, err.message, res);
  }
};

// ? Find and send booking-year automatic Middleware
exports.findYearAndPassOn = async (req, res, next) => {
  try {
    const { bookingID } = req.query;
    if (!bookingID) throw new Error('No bookingID provided.');

    const tourDocs = await Tour.find();

    let bookingFound = false;
    let year;

    for (const tour of tourDocs) {
      for (const booking of tour.bookings) {
        if (booking.id === bookingID) {
          year = booking.start.getFullYear().toString();
          bookingFound = true;
          break;
        }
      }
    }
    if (!bookingFound)
      throw new Error('No booking found with the provided id.');

    req.query = { ...req.query, year };

    next();
  } catch (err) {
    console.log('HERE 2');
    responseHelper(400, err.message, res);
  }
};

// ** This Middleware is for assigning a booking to a guide
exports.assignGuideToBooking = async (req, res, next) => {
  try {
    const { bookingID, guide, year } = req.query;

    if (!bookingID || !guide || !year)
      throw new Error('Please selected a booking,guide & year.');

    const doc = await Tour.findOne({ year: Number(year) });
    if (!doc) throw new Error('No collection found with the provided year.');

    const guideDoc = await Guide.findOne({ email: guide });
    if (!guideDoc)
      throw new Error('No guide found with the provided guide-email.');

    const booking = doc.bookings.find((el) => el.id === bookingID);
    if (!booking)
      throw new Error('No booking found with the provided bookingID.');

    if (booking.guide) {
      const oldGuide = await Guide.findById(booking.guide._id);

      const guideBookings = oldGuide.guide_bookings.find(
        (el) => el.year === Number(year)
      );
      if (guideBookings) {
        guideBookings.bookings = guideBookings.bookings.filter(
          (el) => el.id !== bookingID
        );

        await oldGuide.save();
      }
    }

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
    await Bookings.findByIdAndUpdate(bookingID, {
      guide: guideDoc._id,
    });

    const BOOKINGS_BOOKING = await Bookings.findOneAndUpdate(
      {
        uuid: booking.uuid,
      },
      {
        guide: guideDoc._id,
      }
    );

    if (!BOOKINGS_BOOKING)
      throw new Error('No booking found in all bookings doc');

    const bookingAllReadyInGuideArray = guideBookingsYearDoc.bookings.find(
      (el) => {
        if (JSON.stringify(el.id) === JSON.stringify(booking.id)) return el;
      }
    );

    if (!bookingAllReadyInGuideArray) {
      guideBookingsYearDoc.bookings.push(booking);
    }

    await guideDoc.save();
    await doc.save();
    await BOOKINGS_BOOKING.save();

    responseHelper(200, 'Booking successfully assigned to guide.', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** This Middleware is for removing a guide from an existing booking
exports.removeGuideFromBooking = async (req, res, next) => {
  try {
    const { bookingID, year } = req.query;

    if (!bookingID || !year)
      throw new Error('Please selected a booking and year.');

    const doc = await Tour.findOne({ year: Number(year) });
    if (!doc) throw new Error('No collection found with the provided year.');

    const booking = doc.bookings.find((el) => el.id === bookingID);
    if (!booking)
      throw new Error('No booking found with the provided bookingID.');

    if (!booking.guide) {
      throw new Error("The selected booking don't have a guide yet.");
    }

    const guideDoc = await Guide.findById(booking.guide);

    const guideBookingsIndex = guideDoc.guide_bookings.findIndex(
      (el) => el.year === +year
    );
    if (guideBookingsIndex < 0)
      throw new Error(
        `Year [${year}] was not found in ${guideDoc.fullName} bookings document`
      );

    guideDoc.guide_bookings[guideBookingsIndex].bookings =
      guideDoc.guide_bookings[guideBookingsIndex].bookings.filter(
        (el) => el.id !== bookingID
      );

    await guideDoc.save();

    booking.guide = null;
    await Bookings.findByIdAndUpdate(bookingID, {
      guide: null,
    });

    const BOOKINGS_BOOKING = await Bookings.findOneAndUpdate(
      {
        title: booking.title,
        start: booking.start,
        end: booking.end,
        status: booking.status,
        color: booking.color,
        description: booking.description,
        contactPerson: booking.contactPerson,
        participants: booking.participants,
      },
      {
        guide: null,
      }
    );

    await doc.save();
    await BOOKINGS_BOOKING.save();

    responseHelper(200, 'Guide successfully removed from booking.', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** Update booking status Middleware
exports.updateBooking = async (req, res, next) => {
  try {
    if (req.body.guide || req.body.id || req.body._id)
      throw new Error(
        "You can't update guide here. You are not allowed to change document id."
      );
    const { bookingID, year } = req.query;
    if (!bookingID || !year)
      throw new Error('Please provide bookingID and year.');

    const tourDoc = await Tour.findOne({ year: Number(year) });
    if (!tourDoc) throw new Error('No tour document found.');

    const bookingIndex = tourDoc.bookings.findIndex(
      (el) => el.id === bookingID
    );
    if (bookingIndex === -1) {
      throw new Error('No booking found with the provided id');
    }
    const { status } = req.body || tourDoc.bookings[bookingIndex].status;

    const color =
      status === 'confirmed'
        ? '#2dc653'
        : status === 'cancelled'
        ? '#f21b3f'
        : '#ffc300';

    const BOOKINGS_BOOKING = await Bookings.findOneAndUpdate(
      {
        uuid: tourDoc.bookings[bookingIndex].uuid,
      },
      {
        ...req.body,
        status,
        color,
      }
    );

    await BOOKINGS_BOOKING.save();

    tourDoc.bookings[bookingIndex] = {
      ...tourDoc.bookings[bookingIndex].toObject(),
      ...req.body,
      status,
      color,
    };

    await Bookings.findByIdAndUpdate(bookingID, {
      ...req.body,
      status,
      color,
    });

    const guides = await Guide.find();

    // Iterate through each guide
    for (const guide of guides) {
      // Iterate through each guide booking for the guide
      for (const guideBooking of guide.guide_bookings) {
        // Search for the booking with the provided bookingID
        const bookingIndex = guideBooking.bookings.findIndex(
          (book) => book.id === bookingID
        );
        if (bookingIndex !== -1) {
          guideBooking.bookings[bookingIndex] = {
            ...guideBooking.bookings[bookingIndex].toObject(),
            ...req.body,
            status,
            color,
          };
          await guide.save();
          break;
        }
      }
    }

    await tourDoc.save();

    responseHelper(200, 'Booking successfully updated', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** Delete booking Middleware
exports.deleteBooking = async (req, res, next) => {
  try {
    const { bookingID, year } = req.query;
    if (!bookingID || !year) throw new Error('No bookingID or year provided.');

    const tourYearDoc = await Tour.findOne({ year });
    const bookingIndex = tourYearDoc.bookings.findIndex(
      (el) => el.id === bookingID
    );

    if (bookingIndex < 0) throw new Error('No booking found');

    if (tourYearDoc.bookings[bookingIndex].guide) {
      const guideID = tourYearDoc.bookings[bookingIndex].guide;
      const guideDoc = await Guide.findById(guideID);
      const guideBookingYearDocIndex = guideDoc.guide_bookings.findIndex(
        (el) => el.year === +year
      );

      const bookingIndexGuide = guideDoc.guide_bookings[
        guideBookingYearDocIndex
      ].bookings.findIndex((el) => el.id === bookingID);

      guideDoc.guide_bookings[guideBookingYearDocIndex].bookings.splice(
        bookingIndexGuide,
        1
      );

      await guideDoc.save();
    }

    await Bookings.findOneAndDelete({
      title: tourYearDoc.bookings[bookingIndex].title,
      start: tourYearDoc.bookings[bookingIndex].start,
      end: tourYearDoc.bookings[bookingIndex].end,
      status: tourYearDoc.bookings[bookingIndex].status,
      color: tourYearDoc.bookings[bookingIndex].color,
      description: tourYearDoc.bookings[bookingIndex].description,
      contactPerson: tourYearDoc.bookings[bookingIndex].contactPerson,
      participants: tourYearDoc.bookings[bookingIndex].participants,
    });

    tourYearDoc.bookings.splice(bookingIndex, 1);

    await tourYearDoc.save();
    await Bookings.findByIdAndDelete(bookingID);

    responseHelper(200, 'Booking successfully deleted.', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** Get all tours by year Middleware
exports.getAllBookingsByYearAndFilter = async (req, res, next) => {
  try {
    const { year, ...filterObj } = req.query;
    if (!year) throw new Error('No year provided.');

    const tourDoc = await Tour.findOne({ year });
    if (!tourDoc) throw new Error('No document with the provided year found.');
    const bookings = tourDoc.bookings;
    if (!bookings.length > 0)
      throw new Error('No bookings found with the provided credentials.');

    const filteredBookings = bookings.filter((booking) => {
      for (const [key, value] of Object.entries(filterObj)) {
        if (key === 'month') {
          // Extract month from tourDate and compare with provided month
          const bookingMonth = new Date(booking.start).getMonth() + 1; // Month is 0-indexed
          if (parseInt(value) !== bookingMonth) return false;
        } else if (key === 'guide') {
          // Guide ID is stored as a string, so compare directly
          if (value !== booking.guide._id.toString()) return false;
        } else if (key === 'day') {
          const bookingDay = new Date(booking.start).getDate();
          if (parseInt(value) !== bookingDay) return false;
        } else {
          // For other filters, compare directly
          if (value !== booking[key]) return false;
        }
      }
      return true;
    });

    if (!filteredBookings.length > 0)
      throw new Error('No booking found that matches your filter options.');

    // for (let i = 0; i < filteredBookings.length; i++) {
    //   const el = filteredBookings[i];
    //   const found = await Bookings.findOne({
    //     title: el.title,
    //     start: el.start,
    //     end: el.end,
    //     status: el.status,
    //     color: el.color,
    //     description: el.description,
    //     contactPerson: el.contactPerson,
    //     participants: el.participants,
    //   });
    //   if (found) {
    //     filteredBookings[i] = found;
    //   }
    // }

    responseHelper(200, 'Bookings successfully fetched', res, {
      year: Number(year),
      count: filteredBookings.length,
      result: filteredBookings,
    });
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** Get a specific booking by filter-options Middleware
exports.getOneBookingByYearAndId = async (req, res, next) => {
  try {
    const { year, bookingID } = req.query;
    if (!year) throw new Error('No year provided.');

    const tourDoc = await Tour.findOne({ year });
    if (!tourDoc) throw new Error('No document with the provided year found.');
    const bookings = tourDoc.bookings;
    if (!bookings.length > 0)
      throw new Error('No bookings found with the provided credentials.');

    const booking = bookings.find((el) => el.id === bookingID);

    if (!booking)
      throw new Error('No booking found with the provided bookingID');

    const foundBooking = await Bookings.findOne({
      title: booking.title,
      start: booking.start,
      end: booking.end,
      status: booking.status,
      color: booking.color,
      description: booking.description,
      contactPerson: booking.contactPerson,
      participants: booking.participants,
    });

    if (!foundBooking)
      throw new Error('No booking found with the provided bookingID');

    responseHelper(200, 'Bookings successfully fetched', res, {
      booking: foundBooking,
    });
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};
