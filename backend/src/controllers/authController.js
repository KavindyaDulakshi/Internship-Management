const authService = require('../services/authService');

/**
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { email, password, fullName, university, degree } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters.' });
    }

    const { user } = await authService.signUp({ email, password, fullName, university, degree });

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully. You can now sign in.',
      data: { user: { id: user.id, email: user.email } },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/signin
 */
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }

    const result = await authService.signIn({ email, password });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/signout
 */
const signout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (token) {
      await authService.signOut(token);
    }

    res.status(200).json({ status: 'success', message: 'Signed out successfully.' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ status: 'error', message: 'Refresh token is required.' });
    }

    const result = await authService.refreshSession(refreshToken);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Requires: Authorization: Bearer <token>
 */
const me = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'Authentication token missing.' });
    }

    const user = await authService.getMe(token);

    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, signin, signout, refresh, me };
