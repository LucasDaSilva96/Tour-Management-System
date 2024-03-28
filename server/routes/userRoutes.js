const express = require('express');
const { signUp, login } = require('../controllers/authController');
const { getAllUsers } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);
router.post('/signUp', signUp);
router.post('/logIn', login);

module.exports = router;
