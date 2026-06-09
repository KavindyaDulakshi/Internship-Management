const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

/**
 * Compiles express-validator validation results.
 * If validation errors exist, throws a structured 400 Bad Request error.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors
      .array()
      .map(err => `${err.path || err.param}: ${err.msg}`)
      .join(', ');
    return next(new AppError(`Validation error: ${errorMsg}`, 400));
  }
  next();
};

module.exports = validate;
