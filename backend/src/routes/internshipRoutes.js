const express = require('express');
const { body, param } = require('express-validator');
const internshipController = require('../controllers/internshipController');
const { protect, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Validation schemas
const createValidationRules = [
  body('companyId')
    .notEmpty()
    .withMessage('Company ID is required')
    .bail()
    .custom(val => !isNaN(val) || typeof val === 'string')
    .withMessage('Company ID must be a number or string identifier'),
  body('title').trim().notEmpty().withMessage('Internship title is required'),
  body('description').trim().notEmpty().withMessage('Internship description is required'),
  body('location').trim().notEmpty().withMessage('Job location is required'),
  body('type').trim().notEmpty().withMessage('Job type classification is required'),
  body('duration').trim().notEmpty().withMessage('Internship duration is required'),
  body('salary').trim().notEmpty().withMessage('Salary / stipend text is required'),
  body('skills').optional().isArray().withMessage('Skills must be an array of strings')
];

const updateValidationRules = [
  param('id').notEmpty().withMessage('Internship ID param is required'),
  body('companyId').optional().custom(val => !isNaN(val) || typeof val === 'string'),
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('location').optional().trim().notEmpty(),
  body('type').optional().trim().notEmpty(),
  body('duration').optional().trim().notEmpty(),
  body('salary').optional().trim().notEmpty(),
  body('skills').optional().isArray().withMessage('Skills must be an array of strings')
];

// PUBLIC OR OPTIONALLY AUTHENTICATED ENDPOINTS
// GET /api/internships - List/Search
router.get('/', optionalAuth, internshipController.getAllInternships);

// GET /api/internships/:id - Details
router.get('/:id', optionalAuth, internshipController.getInternshipById);

// PROTECTED ENDPOINTS (REQUIRES AUTHENTICATED USER)
// POST /api/internships - Create
router.post('/', protect, createValidationRules, validate, internshipController.createInternship);

// PUT /api/internships/:id - Update
router.put('/:id', protect, updateValidationRules, validate, internshipController.updateInternship);

// DELETE /api/internships/:id - Delete
router.delete('/:id', protect, internshipController.deleteInternship);

// POST /api/internships/:id/save - Toggle Save Bookmark
router.post('/:id/save', protect, internshipController.toggleSaveInternship);

module.exports = router;
