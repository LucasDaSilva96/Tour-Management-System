const multer = require('multer');
const { responseHelper } = require('./httpResponse');
const { Guide } = require('../models/guideModel');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.params.id) {
      cb(null, 'public/img/users');
    } else {
      cb(null, 'public/img/guides');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      req.err = null;
      cb(null, true);
    } else {
      req.err = 'Not an image, please upload an image.';
      return cb(null, false);
    }
  },
});
exports.upload = upload;

exports.uploadImageToDB = async (req, res, next) => {
  try {
    if (!req.file) throw new Error('No file provided.');
    if (req.err) throw new Error(req.err);

    if (req.params.id) {
      const USER = await User.findById(req.params.id);

      if (!USER.photo.includes('default.jpg')) {
        // Delete the old image file
        fs.unlink(`public/img/users/${USER.photo.split('users')[1]}`, (err) => {
          if (err) throw new Error(err);
        });
      }

      await User.findByIdAndUpdate(req.params.id, {
        photo: `${req.protocol}://${req.get('host')}/public/img/users/${
          req.file.filename
        }`,
      });
    } else if (req.params.guideID) {
      const { guideID } = req.params;
      if (!guideID) throw new Error('No guide id defined');

      const GUIDE = await Guide.findById(guideID);

      if (!GUIDE.photo.includes('default.jpg')) {
        // Delete the old image file
        fs.unlink(
          `public/img/guides/${GUIDE.photo.split('guides')[1]}`,
          (err) => {
            if (err) throw new Error(err);
          }
        );
      }

      await Guide.findByIdAndUpdate(guideID, {
        photo: `${req.protocol}://${req.get('host')}/public/img/guides/${
          req.file.filename
        }`,
      });
    } else {
      throw new Error('Invalid upload settings/options.');
    }

    responseHelper(200, 'Image successfully uploaded', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};
