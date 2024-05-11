// Import required modules and controllers
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

// Create express router
const router = express.Router();

// Define routes
router.get('/bookings', getAllBookingsByYearAndFilter); // Route to get all bookings by year and filter
router.get('/tourDocs', getAllYearsBookingDocs); // Route to get all tour documents

router.use(protect); // Middleware to protect routes below
router.post('/createBooking', createYearDocument, createTour); // Route to create a new booking

router.delete('/booking/delete', deleteBooking); // Route to delete a booking

router.use(findYearAndPassOn); // Middleware to find the year and pass it on to subsequent routes
router.post('/booking/assignGuide', createYearDocument, assignGuideToBooking); // Route to assign a guide to a booking
router.post('/booking/removeGuide', removeGuideFromBooking); // Route to remove a guide from a booking
router.patch('/booking/update', updateBooking); // Route to update a booking
router.get('/booking', getOneBookingByYearAndId); // Route to get one booking by year and ID

module.exports = router;
