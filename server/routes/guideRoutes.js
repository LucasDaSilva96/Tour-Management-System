// Import required modules and controllers
const express = require('express');
const { protect } = require('../controllers/authController');
const {
  createGuide,
  getAllGuides,
  updateGuide,
  deleteOneGuide,
} = require('../controllers/guideController');
const { upload, uploadImageToDB } = require('../utils/upload');

// Create express router
const router = express.Router();

// Define routes
router.get('/getGuides', getAllGuides); // Route to get all guides
router.use(protect); // Middleware to protect routes below

router.post('/createNewGuide', createGuide); // Route to create a new guide
router.patch('/updateGuide/:guideID', updateGuide); // Route to update a guide
router.post(
  '/uploadGuideImage/:guideID',
  upload.single('image'),
  uploadImageToDB
); // Route to upload an image for a guide
router.delete('/deleteGuide/:guideID', deleteOneGuide); // Route to delete a guide

// Export router
module.exports = router;
