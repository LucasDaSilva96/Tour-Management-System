const express = require('express');
const { protect } = require('../controllers/authController');
const { createTour } = require('../controllers/tourController');

const router = express.Router();

router.post('/', protect, createTour);

module.exports = router;
