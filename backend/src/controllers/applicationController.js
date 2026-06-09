const applicationService = require('../services/applicationService');

/**
 * GET /api/applications
 */
const listApplications = async (req, res, next) => {
  try {
    const apps = await applicationService.getUserApplications(req.user.id);
    res.status(200).json({ status: 'success', results: apps.length, data: { applications: apps } });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/applications
 * Body: { internshipId: string }
 */
const applyToInternship = async (req, res, next) => {
  try {
    const { internshipId } = req.body;
    if (!internshipId) {
      return res.status(400).json({ status: 'error', message: 'internshipId is required.' });
    }
    const app = await applicationService.applyToInternship(req.user.id, internshipId);
    res.status(201).json({ status: 'success', data: { application: app } });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/applications/:id
 */
const withdrawApplication = async (req, res, next) => {
  try {
    await applicationService.withdrawApplication(req.user.id, req.params.id);
    res.status(200).json({ status: 'success', message: 'Application withdrawn.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { listApplications, applyToInternship, withdrawApplication };
