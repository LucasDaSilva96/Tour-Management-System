const express = require('express');
const {
  signUp,
  login,
  logOut,
  protect,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/', protect, getAllUsers);
router.post('/signUp', signUp);
router.post('/logIn', login);
router.post('/logOut', logOut);
router.post('/resetPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

module.exports = router;
