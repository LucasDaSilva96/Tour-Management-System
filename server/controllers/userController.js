const { responseHelper } = require('./authController');
const User = require('../models/userModel');

// ** The get all users Middleware
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users.length) throw new Error('The Database is empty...');

    responseHelper(200, `${users.length} found`, res, users);
  } catch (err) {
    responseHelper(404, err.message, res);
  }
};
