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

router.use(protect);

router.post('/createNewGuide', createGuide);
router.get('/getGuides', getAllGuides);
router.patch('/updateGuide/:guideID', updateGuide);
router.post(
  '/uploadGuideImage/:guideID',
  upload.single('image'),
  uploadImageToDB
);
router.delete('/deleteGuide/:guideID', deleteOneGuide);

module.exports = router;
