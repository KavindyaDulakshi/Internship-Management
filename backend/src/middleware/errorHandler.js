const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operational, trusted error: send message to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server.'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle specific Supabase or PostgREST errors
  if (err.code && err.details !== undefined) {
    // This is likely a PostgreSQL/Supabase error
    // Translate some common SQL codes to user-friendly messages
    if (err.code === '23505') {
      err.message = 'A record with this information already exists.';
      err.statusCode = 409;
    } else if (err.code === '23503') {
      err.message = 'Referenced record does not exist.';
      err.statusCode = 400;
    } else if (err.code === '42703') {
      err.message = 'Database schema mismatch: Column not found.';
      err.statusCode = 500;
    } else {
      err.message = err.message || 'Database operation failed.';
      err.statusCode = 400;
    }
    err.isOperational = true;
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};
