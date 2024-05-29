// Import required modules
const multer = require('multer');
const { responseHelper } = require('./httpResponse');
const { Guide } = require('../models/guideModel');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination folder based on request parameters
    if (req.params.id) {
      cb(null, '/public/img/users');
    } else {
      cb(null, 'public/img/guides');
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename for uploaded file
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Configure multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Check file type to ensure it is an image
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      req.err = null; // Clear any previous error message
      cb(null, true); // Accept the file
    } else {
      req.err = 'Not an image, please upload an image.'; // Set error message
      return cb(null, false); // Reject the file upload
    }
  },
});

// Export the multer upload middleware
exports.upload = upload;

// Middleware function to upload image to database
exports.uploadImageToDB = async (req, res, next) => {
  try {
    // Check if a file is provided
    if (!req.file) throw new Error('No file provided.');
    // Check for any previous error message
    if (req.err) throw new Error(req.err);

    // Update user's photo if user ID is provided in request parameters
    if (req.params.id) {
      const USER = await User.findById(req.params.id);

      // Delete the old image file if it's not the default image
      if (!USER.photo.includes('default.jpg')) {
        // Delete the old image file
        fs.unlink(`public/img/users/${USER.photo.split('users')[1]}`, (err) => {
          console.log(err);
        });
      }

      // Update user's photo path in the database
      await User.findByIdAndUpdate(req.params.id, {
        photo: `${req.protocol}://${req.get('host')}/public/img/users/${
          req.file.filename
        }`,
      });
      // Update guide's photo if guide ID is provided in request parameters
    } else if (req.params.guideID) {
      const { guideID } = req.params;
      if (!guideID) throw new Error('No guide id defined');

      const GUIDE = await Guide.findById(guideID);

      // Delete the old image file if it's not the default image
      if (!GUIDE.photo.includes('default.jpg')) {
        // Delete the old image file
        fs.unlink(
          `public/img/guides/${GUIDE.photo.split('guides')[1]}`,
          (err) => {
            if (err) throw new Error(err);
          }
        );
      }

      // Update guide's photo path in the database
      await Guide.findByIdAndUpdate(guideID, {
        photo: `${req.protocol}://${req.get('host')}/public/img/guides/${
          req.file.filename
        }`,
      });
    } else {
      throw new Error('Invalid upload settings/options.');
    }

    // Send success response
    responseHelper(200, 'Image successfully uploaded', res);
  } catch (err) {
    // Send error response
    responseHelper(400, err.message, res);
  }
};
