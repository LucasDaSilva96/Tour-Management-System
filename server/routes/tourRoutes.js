const express = require('express');
const { protect } = require('../controllers/authController');
const {
  createTour,
  createYearDocument,
  assignGuideToBooking,
  updateBooking,
  findYearAndPassOn,
  deleteBooking,
  getAllBookingsByYearAndFilter,
} = require('../controllers/tourController');

const router = express.Router();

router.use(protect);

router.post('/createBooking', createYearDocument, createTour);
router.post(
  '/booking/assignGuide',
  createYearDocument,
  findYearAndPassOn,
  assignGuideToBooking
);
router.patch('/booking/update', findYearAndPassOn, updateBooking);
router.delete('/booking/delete', findYearAndPassOn, deleteBooking);
router.get('/bookings', getAllBookingsByYearAndFilter);
module.exports = router;
