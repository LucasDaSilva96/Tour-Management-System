const express = require('express');
const { protect } = require('../controllers/authController');
const {
  createGuide,
  getAllGuides,
  updateGuide,
  deleteOneGuide,
} = require('../controllers/guideController');
const { upload, uploadImageToDB } = require('../utils/upload');

const router = express.Router();

router.post('/', protect, createGuide);
router.get('/', protect, getAllGuides);
router.patch('/:guideID', protect, updateGuide);
router.post('/:guideID', protect, upload.single('image'), uploadImageToDB);
router.delete('/:guideID', protect, deleteOneGuide);

module.exports = router;
