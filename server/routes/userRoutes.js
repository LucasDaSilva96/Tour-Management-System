// Import required modules and controllers
const express = require('express');
const {
  signUp,
  login,
  logOut,
  protect,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const {
  getAllUsers,
  updateOneUser,
  deleteUser,
  updatePassword,
} = require('../controllers/userController');
const { upload, uploadImageToDB } = require('../utils/upload');

// Create express router
const router = express.Router();

// Define routes
router.post('/signUp', signUp); // Route to sign up new users
router.post('/logIn', login); // Route to log in users
router.get('/', getAllUsers); // Route to get all users
router.post('/logOut', logOut); // Route to log out users
router.post('/resetPassword', forgotPassword); // Route to request password reset
router.patch('/resetPassword/:token', resetPassword); // Route to reset password
router.use(protect); // Middleware to protect routes below
router.post('/uploadUserImage/:id', upload.single('image'), uploadImageToDB); // Route to upload user image
router.patch('/updateMe', updateOneUser); // Route to update user profile
router.delete('/deleteUser/:email', deleteUser); // Route to delete user
router.post('/updatePassword', updatePassword); // Route to update user password

module.exports = router;
