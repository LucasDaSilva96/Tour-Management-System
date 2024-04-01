const Guide = require('../models/guideModel');
const { responseHelper } = require('../utils/httpResponse');

// ** Create guide Middleware
exports.createGuide = async (req, res, next) => {
  try {
    const newGuide = await Guide.create({ ...req.body });
    responseHelper(201, 'Guide successfully created.', res, newGuide);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** Get all guides Middleware
exports.getAllGuides = async (req, res, next) => {
  try {
    const guides = await Guide.find();
    if (!guides.length > 0) throw new Error('No guides in the database.');

    responseHelper(200, 'Guides successfully fetched', res, guides);
  } catch (err) {
    responseHelper(404, err.message, res);
  }
};

// ** UpdateOneGuide Middleware
exports.updateGuide = async (req, res, next) => {
  try {
    const { guideID } = req.params;
    if (!guideID) throw new Error('Please enter a valid guide-id.');

    await Guide.findByIdAndUpdate(guideID, {
      ...req.body,
      updatedAt: Date.now(),
      updatedBy: req.user.name,
    });
    responseHelper(200, 'Guide successfully updated', res);
  } catch (err) {
    responseHelper(404, err.message, res);
  }
};

// ** Delete one guide Middleware
exports.deleteOneGuide = async (req, res, next) => {
  try {
    const { guideID } = req.params;
    if (!guideID) throw new Error('Please enter a valid guide-id.');
    await Guide.findByIdAndUpdate(guideID, { active: false });
    responseHelper(200, 'Guide successfully deleted', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};
