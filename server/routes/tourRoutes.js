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
  getOneBookingByYearAndId,
} = require('../controllers/tourController');

const router = express.Router();

router.use(protect);
router.post('/createBooking', createYearDocument, createTour);
router.get('/bookings', getAllBookingsByYearAndFilter);

router.use(findYearAndPassOn);
router.post('/booking/assignGuide', createYearDocument, assignGuideToBooking);
router.patch('/booking/update', updateBooking);
router.delete('/booking/delete', deleteBooking);
router.get('/booking', getOneBookingByYearAndId);

module.exports = router;
