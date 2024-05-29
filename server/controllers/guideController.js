const { Guide } = require('../models/guideModel');
const { Tour, Bookings } = require('../models/tourModel');
const { responseHelper } = require('../utils/httpResponse');

// Middleware to create a guide
exports.createGuide = async (req, res, next) => {
  try {
    const newGuide = await Guide.create({ ...req.body });
    responseHelper(201, 'Guide successfully created.', res, newGuide);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// Middleware to get all guides
exports.getAllGuides = async (req, res, next) => {
  try {
    const { ...filterObj } = req.query;
    const guides = await Guide.find();
    if (guides.length > 0) {
      const filteredGuides = guides.filter((guide) => {
        guide = guide.toObject();

        for (const [key, value] of Object.entries(filterObj)) {
          if (
            JSON.stringify(guide[key]).toLowerCase() &&
            JSON.stringify(guide[key]).toLowerCase() !==
              JSON.stringify(value).toLowerCase()
          )
            return false;
        }
        return true;
      });

      responseHelper(200, 'Guides successfully fetched', res, {
        count: filteredGuides.length,
        guides: filteredGuides || [],
      });
    } else {
      responseHelper(200, 'Guides successfully fetched', res, {
        count: 0,
        guides: [],
      });
    }
  } catch (err) {
    responseHelper(404, err.message, res);
  }
};

// Middleware to update one guide
exports.updateGuide = async (req, res, next) => {
  try {
    const { guideID } = req.params;
    if (!guideID) throw new Error('Please enter a valid guide-id.');

    const GUIDE = await Guide.findByIdAndUpdate(guideID, {
      ...req.body,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.name,
    });

    responseHelper(200, 'Guide successfully updated', res);
  } catch (err) {
    responseHelper(404, err.message, res);
  }
};

// Middleware to delete one guide
exports.deleteOneGuide = async (req, res, next) => {
  try {
    const { guideID } = req.params;
    if (!guideID) throw new Error('Please enter a valid guide-id.');

    const tourDocs = await Tour.find();
    const BOOKINGS = await Bookings.find();
    await Guide.findByIdAndDelete(guideID);

    for (const tourDoc of tourDocs) {
      for (const booking of tourDoc.bookings) {
        const ID = JSON.stringify(booking.guide).split('"')[1];

        if (ID === guideID) {
          booking.guide = null;
          await tourDoc.save();
        }
      }
    }

    for (const booking of BOOKINGS) {
      if (booking.guide) {
        const ID = booking.guide._id.toString();

        if (ID === guideID) {
          booking.guide = null;
          await booking.save();
        }
      }
    }

    responseHelper(200, 'Guide successfully deleted', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};
