const express = require('express');
const authenticateUser = require('../middlewares/auth');
const {
  registerOrganization,
  getOrganizations,
  generateNewSecretKey,
} = require('../controllers/organizationController');

const router = express.Router();

router.use(authenticateUser);

router.post('/register', registerOrganization);
router.get('/', getOrganizations);
router.post('/:orgId/new-secret', generateNewSecretKey);

module.exports = router;
