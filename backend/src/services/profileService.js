const { supabase } = require('../config/supabase');
const AppError = require('../utils/appError');

/**
 * Get profile by user ID.
 */
const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile row yet — return minimal profile
      return { id: userId, full_name: '', university: '', degree: '', bio: '', avatar_url: '' };
    }
    throw new AppError(error.message, 500);
  }

  return data;
};

/**
 * Upsert (update or create) a profile for a user.
 */
const updateProfile = async (userId, fields) => {
  const allowed = ['full_name', 'university', 'degree', 'bio', 'avatar_url', 'phone', 'location'];
  const payload = { id: userId, updated_at: new Date().toISOString() };

  allowed.forEach((key) => {
    if (fields[key] !== undefined) payload[key] = fields[key];
  });

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload)
    .select()
    .single();

  if (error) throw new AppError(error.message, 500);
  return data;
};

module.exports = { getProfile, updateProfile };
