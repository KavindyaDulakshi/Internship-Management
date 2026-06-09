const { supabase } = require('../config/supabase');
const AppError = require('../utils/appError');

/**
 * Register a new user with email, password, and optional profile metadata.
 * Uses the service-role admin client so the backend controls all auth.
 */
const signUp = async ({ email, password, fullName, university, degree }) => {
  // Step 1: Create the auth user via admin API (bypasses anon key requirement)
  const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // auto-confirm so user can log in immediately
    user_metadata: {
      full_name: fullName || '',
      university: university || '',
      degree: degree || '',
    },
  });

  if (adminError) {
    if (adminError.message.includes('already registered') || adminError.message.includes('already been registered')) {
      throw new AppError('An account with this email already exists.', 409);
    }
    throw new AppError(adminError.message, 400);
  }

  const user = adminData.user;

  // Step 2: Upsert a row in the profiles table (best-effort)
  try {
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName || '',
      university: university || '',
      degree: degree || '',
      email: user.email,
      updated_at: new Date().toISOString(),
    });
  } catch (profileErr) {
    console.warn('Profile upsert failed (non-fatal):', profileErr.message);
  }

  return { user };
};

/**
 * Sign in with email and password.
 * Returns access_token, refresh_token, and user object.
 */
const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new AppError('Invalid email or password.', 401);
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in,
    user: {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.user_metadata?.full_name || '',
      university: data.user.user_metadata?.university || '',
      degree: data.user.user_metadata?.degree || '',
    },
  };
};

/**
 * Sign out a user by invalidating their session server-side.
 */
const signOut = async (accessToken) => {
  // Sign out by passing the user's JWT so Supabase invalidates this specific session
  const { error } = await supabase.auth.admin.signOut(accessToken);
  if (error) {
    console.warn('Sign out warning (non-fatal):', error.message);
  }
};

/**
 * Refresh an access token using a refresh token.
 */
const refreshSession = async (refreshToken) => {
  const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

  if (error || !data.session) {
    throw new AppError('Session expired. Please sign in again.', 401);
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in,
    user: {
      id: data.user.id,
      email: data.user.email,
      fullName: data.user.user_metadata?.full_name || '',
      university: data.user.user_metadata?.university || '',
      degree: data.user.user_metadata?.degree || '',
    },
  };
};

/**
 * Get the currently authenticated user from a JWT.
 */
const getMe = async (accessToken) => {
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    throw new AppError('Invalid or expired token.', 401);
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || '',
    university: user.user_metadata?.university || '',
    degree: user.user_metadata?.degree || '',
    createdAt: user.created_at,
  };
};

module.exports = { signUp, signIn, signOut, refreshSession, getMe };
