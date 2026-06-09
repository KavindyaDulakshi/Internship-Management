const { supabase } = require('../config/supabase');
const AppError = require('../utils/appError');

/**
 * Middleware to enforce authentication using Supabase JWT.
 * Extracts the Bearer token, verifies it against Supabase Auth API,
 * and attaches the user data to the request object.
 */
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication token missing. Please sign in.', 401));
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(new AppError('Invalid or expired authentication token.', 401));
    }

    // Attach user information to request
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Optional authentication middleware.
 * If a token is provided, it attempts to verify it and attach the user,
 * but allows the request to proceed if no token is provided.
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      req.user = user;
    }
    next();
  } catch (err) {
    // Graceful fallback for optional auth
    next();
  }
};

module.exports = {
  protect,
  optionalAuth
};
