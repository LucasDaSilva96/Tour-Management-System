const express = require('express');
const { protect } = require('../controllers/authController');
const {
  createTour,
  createYearDocument,
  assignGuideToBooking,
  changeBookingStatus,
} = require('../controllers/tourController');

const router = express.Router();

router.post('/', protect, createYearDocument, createTour);
router.post('/booking', protect, assignGuideToBooking);
router.patch('/booking', protect, changeBookingStatus);

module.exports = router;
