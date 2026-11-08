const express = require('express');
const { userRegister, userLogin, refreshAccessToken } = require('../controllers/authController');

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/refresh', refreshAccessToken);

module.exports = router;
