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

const router = express.Router();

router.post('/signUp', signUp);
router.post('/logIn', login);
router.get('/', getAllUsers);
router.post('/logOut', logOut);
router.use(protect);
router.post('/resetPassword', forgotPassword);
router.post('/uploadUserImage/:id', upload.single('image'), uploadImageToDB);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMe', updateOneUser);
router.delete('/deleteUser/:email', deleteUser);
router.post('/updatePassword', updatePassword);

module.exports = router;
