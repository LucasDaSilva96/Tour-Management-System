const express = require('express');
const { protect } = require('../controllers/authController');
const {
  createTour,
  createYearDocument,
  assignGuideToBooking,
  updateBooking,
  findYearAndPassOn,
} = require('../controllers/tourController');

const router = express.Router();

router.use(protect);

router.post('/', createYearDocument, createTour);
router.post(
  '/booking',
  createYearDocument,
  findYearAndPassOn,
  assignGuideToBooking
);
router.patch('/booking', findYearAndPassOn, updateBooking);

module.exports = router;
