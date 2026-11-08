const crypto = require('crypto');
const Organization = require('../models/Organization');

const registerOrganization = async (req, res) => {
  try {
    const { name, destinationUrl } = req.body;
    const userId = req.userId;

    if (!name) {
      return res.status(400).json({ error: 'Organization name is required' });
    }

    const secretKey = `sec_${crypto.randomBytes(24).toString('hex')}`;

    const organization = await Organization.create({
      name,
      user: userId,
      secretKey,
      destinationUrl: destinationUrl || '',
    });

    return res.status(201).json({
      message: 'Organization registered successfully',
      organization: {
        id: organization._id,
        name: organization.name,
        secretKey: organization.secretKey,
        destinationUrl: organization.destinationUrl,
        createdAt: organization.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({ user: req.userId });
    return res.status(200).json({ organizations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerOrganization,
  getOrganizations,
};
