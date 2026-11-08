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
      secretKeys: [secretKey],
      destinationUrl: destinationUrl || '',
    });

    return res.status(201).json({
      message: 'Organization registered successfully',
      organization,
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

const generateNewSecretKey = async (req, res) => {
  try {
    const { orgId } = req.params;
    const organization = await Organization.findOne({ _id: orgId, user: req.userId });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const newSecretKey = `sec_${crypto.randomBytes(24).toString('hex')}`;
    organization.secretKey = newSecretKey;
    organization.secretKeys.push(newSecretKey);
    await organization.save();

    return res.status(200).json({
      message: 'New secret key generated successfully',
      organization,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerOrganization,
  getOrganizations,
  generateNewSecretKey,
};
