// Import required modules and models
const { responseHelper } = require('../utils/httpResponse');
const User = require('../models/userModel');

// Middleware to get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    // Find all users
    const users = await User.find();

    // Check if users exist
    if (!users.length)
      throw new Error(
        'The Database is empty. Create new user at users/signUp endpoint.'
      );

    // Send response with users
    responseHelper(200, `${users.length} found`, res, users);
  } catch (err) {
    // Send error response
    responseHelper(404, err.message, res);
  }
};

// Middleware to update current user information
exports.updateOneUser = async (req, res, next) => {
  try {
    // Check if user is logged in
    if (!req.user) throw new Error('Please log in first.');

    // Check if password or confirmPassword are provided
    if (req.body.password || req.body.confirmPassword)
      throw new Error(
        'You can not change password here. Please go to the /resetPassword endpoint'
      );

    // Check if user is trying to change their role (only admin can do that)
    if (req.user.role === 'user' && req.body.role)
      throw new Error('You do not have permission to change your role.');

    // Update user information
    const user = await User.findByIdAndUpdate(req.user._id, {
      ...req.body,
    });

    // Check if user exists
    if (!user) throw new Error('No user found. Please log in again.');

    // Save updated user information
    await user.save();
    // Send response with updated user
    responseHelper(201, 'The user was successfully updated', res, user);
  } catch (err) {
    // Send error response
    responseHelper(400, err.message, res);
  }
};

// Middleware to delete user (only admin)
exports.deleteUser = async (req, res, next) => {
  try {
    // Check if user is logged in and is admin
    if (!req.user) throw new Error('Please log in first.');
    if (req.user.role !== 'admin')
      throw new Error('You do not have permission to delete a user.');
    if (!req.params.email) throw new Error('Please provide a email.');

    // Get email from request parameters
    const { email } = req.params;
    // Find user by email and set active to false (soft delete)
    const user = await User.findOneAndUpdate({ email }, { active: false });
    // Save changes
    await user.save();
    // Send success response
    responseHelper(204, 'User successfully deleted.', res);
  } catch (err) {
    // Send error response
    responseHelper(400, err.message, res);
  }
};

// Middleware to update user password
exports.updatePassword = async (req, res, next) => {
  try {
    // Extract required fields from request body
    const { email, currentPassword, newPassword } = req.body;

    // Check if all required fields are provided
    if (!email || !currentPassword || !newPassword)
      throw new Error(
        'Please provide email, current password and new password.'
      );

    // Find user by email and select password field
    const user = await User.findOne({ email: req.body.email }).select(
      '+password'
    );

    // Check if user exists
    if (!user) throw new Error('No user found with the provided email.');

    // Check if provided current password matches the stored password
    if (await user.correctPassword(currentPassword, user.password)) {
      // Update password with new password
      user.password = newPassword;
      // Save user changes
      await user.save();

      // Send success response
      responseHelper(200, 'Password successfully updated', res);
    } else {
      // Send error response if current password is incorrect
      throw new Error('Wrong password. Please verify your current password');
    }
  } catch (err) {
    // Send error response
    responseHelper(400, err.message, res);
  }
};
