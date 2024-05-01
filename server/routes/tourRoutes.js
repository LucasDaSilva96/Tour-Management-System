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
  removeGuideFromBooking,
  getAllYearsBookingDocs,
} = require('../controllers/tourController');

const router = express.Router();

router.get('/bookings', getAllBookingsByYearAndFilter);
router.get('/tourDocs', getAllYearsBookingDocs);

router.use(protect);
router.post('/createBooking', createYearDocument, createTour);

router.delete('/booking/delete', deleteBooking);

router.use(findYearAndPassOn);
router.post('/booking/assignGuide', createYearDocument, assignGuideToBooking);
router.post('/booking/removeGuide', removeGuideFromBooking);
router.patch('/booking/update', updateBooking);
router.get('/booking', getOneBookingByYearAndId);

module.exports = router;
