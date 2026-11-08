const Organization = require('../models/Organization');

const verifyEventOrganization = async (event) => {
  if (!event || !event.secretKey) {
    return { valid: false, reason: 'Missing event or secret key' };
  }

  const organization = await Organization.findOne({
    secretKey: event.secretKey,
    user: event.user,
  });

  if (!organization) {
    return { valid: false, reason: 'Invalid secret key or organization not found' };
  }

  if (!organization.destinationUrl) {
    return { valid: false, reason: 'Organization has no destination URL configured' };
  }

  return { valid: true, organization };
};

module.exports = {
  verifyEventOrganization,
};
