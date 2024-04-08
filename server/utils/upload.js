const multer = require('multer');
const { responseHelper } = require('./httpResponse');
const { Guide } = require('../models/guideModel');
const User = require('../models/userModel');
const path = require('path');

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
      await User.findByIdAndUpdate(req.params.id, {
        photo: `${req.protocol}://${req.get('host')}/public/img/users/${
          req.file.filename
        }`,
      });
    } else {
      const { guideID } = req.params;
      if (!guideID) throw new Error('No guide id defined');

      await Guide.findByIdAndUpdate(guideID, {
        photo: `${req.protocol}://${req.get('host')}/public/img/guides/${
          req.file.filename
        }`,
      });
    }

    responseHelper(200, 'Image successfully uploaded', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};
