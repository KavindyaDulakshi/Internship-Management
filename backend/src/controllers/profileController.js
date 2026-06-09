const profileService = require('../services/profileService');

/**
 * GET /api/profile
 * Returns the authenticated user's profile.
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);
    res.status(200).json({ status: 'success', data: { profile } });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/profile
 * Update the authenticated user's profile fields.
 */
const updateProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    res.status(200).json({ status: 'success', data: { profile } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile };
