const express = require('express');
const authenticateUser = require('../middlewares/auth');
const { registerOrganization, getOrganizations } = require('../controllers/organizationController');

const router = express.Router();

router.use(authenticateUser);

router.post('/register', registerOrganization);
router.get('/', getOrganizations);

module.exports = router;
