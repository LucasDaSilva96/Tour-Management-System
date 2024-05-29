require('dotenv').config();
// Import required modules
const multer = require('multer');
const { responseHelper } = require('./httpResponse');
const { Guide } = require('../models/guideModel');
const User = require('../models/userModel');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination folder based on request parameters
    if (req.params.id) {
      cb(null, './public/img/users');
    } else {
      cb(null, './public/img/guides');
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename for uploaded file
    cb(null, `${Date.now()}-${file.originalname}`);
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
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: 'Booking-System',
    resource_type: 'image',
  };
  try {
    let imageURL = null;
    // Check if a file is provided
    if (!req.file) throw new Error('No file provided.');
    // Check for any previous error message
    if (req.err) throw new Error(req.err);

    // Update user's photo if user ID is provided in request parameters
    if (req.params.id) {
      // const USER = await User.findById(req.params.id);

      // // Delete the old image file if it's not the default image
      // if (!USER.photo.includes('default.jpg')) {
      //   // Delete the old image file
      //   fs.unlink(`public/img/users/${USER.photo.split('users')[1]}`, (err) => {
      //     console.log(err);
      //   });
      // }

      try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        imageURL = result.secure_url;
        console.log(imageURL);
      } catch (error) {
        throw new Error(error.error.toString());
      }

      // Update user's photo path in the database
      await User.findByIdAndUpdate(req.params.id, {
        photo: imageURL,
      });
      // Update guide's photo if guide ID is provided in request parameters
    } else if (req.params.guideID) {
      const { guideID } = req.params;
      if (!guideID) throw new Error('No guide id defined');

      // const GUIDE = await Guide.findById(guideID);

      // // Delete the old image file if it's not the default image
      // if (!GUIDE.photo.includes('default.jpg')) {
      //   // Delete the old image file
      //   fs.unlink(
      //     `public/img/guides/${GUIDE.photo.split('guides')[1]}`,
      //     (err) => {
      //       if (err) throw new Error(err);
      //     }
      //   );
      // }

      try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);
        imageURL = result.secure_url;
        console.log(imageURL);
      } catch (error) {
        throw new Error(error.error.toString());
      }

      // Update guide's photo path in the database
      await Guide.findByIdAndUpdate(guideID, {
        photo: imageURL,
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
