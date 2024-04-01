const { responseHelper } = require('../utils/httpResponse');

const User = require('../models/userModel');

// ** The get all users Middleware
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users.length)
      throw new Error(
        'The Database is empty. Create new user at users/signUp endpoint.'
      );

    responseHelper(200, `${users.length} found`, res, users);
  } catch (err) {
    responseHelper(404, err.message, res);
  }
};

// ** Update current user information Middleware
exports.updateOneUser = async (req, res, next) => {
  try {
    if (!req.user) throw new Error('Please log in first.');

    if (req.body.password || req.body.confirmPassword)
      throw new Error(
        'You can not change password here. Please go to the /resetPassword endpoint'
      );

    if (req.user.role === 'user' && req.body.role)
      throw new Error('You do not have permission to change your role.');

    const user = await User.findByIdAndUpdate(req.user._id, {
      ...req.body,
    });

    if (!user) throw new Error('No user found. Please log in again.');

    await user.save();
    responseHelper(201, 'The user was successfully updated', res, user);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};

// ** Delete user - Only admin Middleware
exports.deleteUser = async (req, res, next) => {
  try {
    if (!req.user) throw new Error('Please log in first.');
    if (req.user.role !== 'admin')
      throw new Error('You do not have permission to delete a user.');
    if (!req.params.email) throw new Error('Please provide a email.');

    const { email } = req.params;
    const user = await User.findOneAndUpdate({ email }, { active: false });
    await user.save();
    responseHelper(204, 'User successfully deleted.', res);
  } catch (err) {
    responseHelper(400, err.message, res);
  }
};
