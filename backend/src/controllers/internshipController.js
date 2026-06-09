const internshipService = require('../services/internshipService');

/**
 * Get all internships matching optional query filters.
 * GET /api/internships
 */
const getAllInternships = async (req, res, next) => {
  try {
    const filters = {
      search: req.query.search,
      type: req.query.type,
      duration: req.query.duration,
      location: req.query.location
    };
    
    const profileId = req.user ? req.user.id : null;
    const internships = await internshipService.getAll(filters, profileId);

    res.status(200).json({
      status: 'success',
      results: internships.length,
      data: { internships }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single internship details.
 * GET /api/internships/:id
 */
const getInternshipById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profileId = req.user ? req.user.id : null;
    const internship = await internshipService.getById(id, profileId);

    res.status(200).json({
      status: 'success',
      data: { internship }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new internship.
 * POST /api/internships
 */
const createInternship = async (req, res, next) => {
  try {
    const internship = await internshipService.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: { internship }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing internship.
 * PUT /api/internships/:id
 */
const updateInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const internship = await internshipService.update(id, req.body);

    res.status(200).json({
      status: 'success',
      data: { internship }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete an internship.
 * DELETE /api/internships/:id
 */
const deleteInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    await internshipService.remove(id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle bookmark state for an internship.
 * POST /api/internships/:id/save
 */
const toggleSaveInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profileId = req.user.id; // Enforced by protect middleware
    const result = await internshipService.toggleSave(id, profileId);

    res.status(200).json({
      status: 'success',
      message: result.saved ? 'Internship saved to bookmarks.' : 'Internship removed from bookmarks.',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  toggleSaveInternship
};
