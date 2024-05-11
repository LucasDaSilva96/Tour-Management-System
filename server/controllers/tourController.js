// Import required modules and models
const { Guide } = require('../models/guideModel');
const { Tour, Bookings } = require('../models/tourModel');
const { responseHelper } = require('../utils/httpResponse');

// Helper function to check if the booking has a valid year
const isValidYear = (date) => {
  const currentYear = new Date().getFullYear();
  const providedYear = new Date(date).toISOString().split('-')[0];
  if (Number(providedYear) < currentYear) {
    return false;
  } else {
    return true;
  }
};

// Middleware to create a tour booking
exports.createTour = async (req, res, next) => {
  try {
    let { start } = req.body;

    // Check if start date is provided and valid
    if (!start) throw new Error('A tour must have a date.');
    if (isValidYear(start) === false)
      throw new Error('A booking must take place in the present or future.');
    // Find or create tour document for the year
    const period = await Tour.findOne({
      year: Number(start.toString().split('-')[0]),
    });

    if (!period)
      throw new Error('The document for the provided year is not yet created');

    start = new Date(req.body.start);
    const timeIsTaken = period.bookings.find((el) => {
      return el.start.toISOString() === start.toISOString();
    });

    // Check if the requested time slot is already booked
    if (timeIsTaken)
      throw new Error(
        'You already have a booking on the provided day and time.'
      );

    // Add the booking to the tour document
    let newBooking = undefined;
    if (req.body.status) {
      const color =
        req.body.status === 'confirmed'
          ? '#2dc653'
          : req.body.status === 'cancelled'
          ? '#f21b3f'
          : '#ffc300';

      period.bookings.push({ ...req.body, color });
      newBooking = await Bookings.create({ ...req.body, color });
    } else {
      period.bookings.push({ ...req.body });
      newBooking = await Bookings.create({ ...req.body });
    }

    await period.save();

    // Send success response with the created booking
    responseHelper(
      201,
      'Tour successfully created',
      res,
      period.bookings[period.bookings.length - 1]._doc
    );
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// Middleware to create tour documents automatically
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

    // Create tour documents for future years if not already present
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

    // Create guide booking documents for future years
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

// Middleware to find and send booking-year automatically
exports.findYearAndPassOn = async (req, res, next) => {
  try {
    const { bookingID } = req.query;
    if (!bookingID) throw new Error('No bookingID provided.');

    // Find tour documents and extract the year for the provided bookingID
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

    // Pass on the found year in the request query
    req.query = { ...req.query, year };

    next();
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// Middleware to assign a guide to a booking
exports.assignGuideToBooking = async (req, res, next) => {
  try {
    const { bookingID, guide, year } = req.query;

    // Check if all required parameters are provided
    if (!bookingID || !guide || !year)
      throw new Error('Please selected a booking,guide & year.');

    // Find tour and guide documents
    const doc = await Tour.findOne({ year: Number(year) });
    if (!doc) throw new Error('No collection found with the provided year.');

    const guideDoc = await Guide.findOne({ email: guide });
    if (!guideDoc)
      throw new Error('No guide found with the provided guide-email.');

    // Find the booking in the tour document
    const booking = doc.bookings.find((el) => el.id === bookingID);
    if (!booking)
      throw new Error('No booking found with the provided bookingID.');

    // Remove the booking from the previous guide's bookings
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

    // Create guide booking document for the year if not already present
    const guideBookingsYearDoc = guideDoc.guide_bookings.find(
      (el) => el.year === Number(year)
    );
    if (!guideBookingsYearDoc && Number(year) >= new Date().getFullYear()) {
      guideDoc.guide_bookings.push({
        year: Number(year),
        bookings: [],
      });
    }

    // Assign guide to the booking
    booking.guide = guideDoc._id;
    await Bookings.findByIdAndUpdate(bookingID, {
      guide: guideDoc._id,
    });

    // Update guide's bookings
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

// Middleware to remove a guide from a booking
exports.removeGuideFromBooking = async (req, res, next) => {
  try {
    const { bookingID, year } = req.query;

    // Check if bookingID and year are provided
    if (!bookingID || !year)
      throw new Error('Please selected a booking and year.');

    // Find tour document
    const doc = await Tour.findOne({ year: Number(year) });
    if (!doc) throw new Error('No collection found with the provided year.');

    // Find the booking in the tour document
    const booking = doc.bookings.find((el) => el.id === bookingID);
    if (!booking)
      throw new Error('No booking found with the provided bookingID.');

    // Check if the booking already has a guide
    if (!booking.guide) {
      throw new Error("The selected booking don't have a guide yet.");
    }

    // Find the guide document
    const guideDoc = await Guide.findById(booking.guide);

    // Find the index of the guide booking for the provided year
    const guideBookingsIndex = guideDoc.guide_bookings.findIndex(
      (el) => el.year === +year
    );
    if (guideBookingsIndex < 0)
      throw new Error(
        `Year [${year}] was not found in ${guideDoc.fullName} bookings document`
      );

    // Remove the booking from the guide's bookings
    guideDoc.guide_bookings[guideBookingsIndex].bookings =
      guideDoc.guide_bookings[guideBookingsIndex].bookings.filter(
        (el) => el.id !== bookingID
      );

    await guideDoc.save();

    booking.guide = null;
    await Bookings.findByIdAndUpdate(bookingID, {
      guide: null,
    });

    // Remove the guide from the booking
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

// Middleware to update booking status
exports.updateBooking = async (req, res, next) => {
  try {
    if (req.body.guide || req.body.id || req.body._id)
      throw new Error(
        "You can't update guide here. You are not allowed to change document id."
      );
    const { bookingID, year } = req.query;
    if (!bookingID || !year)
      throw new Error('Please provide bookingID and year.');

    // Find tour document
    const tourDoc = await Tour.findOne({ year: Number(year) });
    if (!tourDoc) throw new Error('No tour document found.');

    // Find the index of the booking in the tour document
    const bookingIndex = tourDoc.bookings.findIndex(
      (el) => el.id === bookingID
    );
    if (bookingIndex === -1) {
      throw new Error('No booking found with the provided id');
    }
    const { status } = req.body || tourDoc.bookings[bookingIndex].status;

    // Update booking status and color
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

    // Update bookings for each guide
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

// Middleware to delete a booking
exports.deleteBooking = async (req, res, next) => {
  try {
    const { uuid, year } = req.query;
    if (!uuid || !year) throw new Error('No uuid or year provided.');

    // Find tour document
    const tourYearDoc = await Tour.findOne({ year });
    const bookingIndex = tourYearDoc.bookings.findIndex(
      (el) => el.uuid === uuid
    );

    if (bookingIndex < 0) throw new Error('No booking found');

    // If booking has a guide, remove it from the guide's bookings
    if (tourYearDoc.bookings[bookingIndex].guide) {
      const guideID = tourYearDoc.bookings[bookingIndex].guide;
      const guideDoc = await Guide.findById(guideID);
      const guideBookingYearDocIndex = guideDoc.guide_bookings.findIndex(
        (el) => el.year === +year
      );

      const bookingIndexGuide = guideDoc.guide_bookings[
        guideBookingYearDocIndex
      ].bookings.findIndex((el) => el.uuid === uuid);

      guideDoc.guide_bookings[guideBookingYearDocIndex].bookings.splice(
        bookingIndexGuide,
        1
      );

      await guideDoc.save();
    }

    // Delete booking from tour document and Bookings collection
    await Bookings.findOneAndDelete({
      uuid,
    });

    tourYearDoc.bookings.splice(bookingIndex, 1);

    await tourYearDoc.save();
    await Bookings.findOneAndDelete({ uuid });

    responseHelper(200, 'Booking successfully deleted.', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// Middleware to get all bookings by year and filter options
exports.getAllBookingsByYearAndFilter = async (req, res, next) => {
  try {
    const { year, ...filterObj } = req.query;
    if (!year) throw new Error('No year provided.');

    // Find tour document
    const tourDoc = await Tour.findOne({ year });
    if (!tourDoc) throw new Error('No document with the provided year found.');
    const bookings = tourDoc.bookings;
    if (!bookings.length > 0) {
      return responseHelper(200, 'Bookings successfully fetched', res, {
        year: Number(year),
        count: 0,
        result: [],
      });
    }

    // Filter bookings based on provided filters
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

    responseHelper(200, 'Bookings successfully fetched', res, {
      year: Number(year),
      count: filteredBookings.length,
      result: filteredBookings,
    });
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// Middleware to get a specific booking by filter options
exports.getOneBookingByYearAndId = async (req, res, next) => {
  try {
    const { year, bookingID } = req.query;
    if (!year) throw new Error('No year provided.');

    // Find tour document
    const tourDoc = await Tour.findOne({ year });
    if (!tourDoc) throw new Error('No document with the provided year found.');
    const bookings = tourDoc.bookings;
    if (!bookings.length > 0)
      throw new Error('No bookings found with the provided credentials.');

    // Find the booking by bookingID
    const booking = bookings.find((el) => el.id === bookingID);

    if (!booking)
      throw new Error('No booking found with the provided bookingID');

    // Find the booking in Bookings collection
    const foundBooking = await Bookings.findOne({
      uuid: booking.uuid,
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

// Middleware to get all tour documents
exports.getAllYearsBookingDocs = async (req, res, next) => {
  try {
    // Find all tour documents
    const tourDocs = await Tour.find().select('-__v');

    res.json({
      status: 200,
      message: 'Tour-docs successfully fetched.',
      data: tourDocs,
    });
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};
