const express = require('express');
const { protect } = require('../controllers/authController');
const {
  createTour,
  createYearDocument,
  assignGuideToBooking,
} = require('../controllers/tourController');

const router = express.Router();

router.post('/', protect, createYearDocument, createTour);
router.post('/booking', assignGuideToBooking);

module.exports = router;
