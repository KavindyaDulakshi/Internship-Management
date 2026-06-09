const { supabase } = require('../config/supabase');
const AppError = require('../utils/appError');

// In-memory fallback if 'applications' table doesn't exist yet
const inMemoryApps = new Map(); // userId -> [{ id, internshipId, appliedAt, status }]
let appIdCounter = 1;

/**
 * List all applications for a user.
 */
const getUserApplications = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, internship:internships(id, title, location, salary, company:companies(name, logo_url))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('DB applications query failed, using in-memory fallback:', err.message);
    return inMemoryApps.get(userId) || [];
  }
};

/**
 * Submit an application for an internship.
 */
const applyToInternship = async (userId, internshipId) => {
  try {
    // Check if already applied
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', userId)
      .eq('internship_id', internshipId)
      .single();

    if (existing) {
      throw new AppError('You have already applied to this internship.', 409);
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([{ user_id: userId, internship_id: internshipId, status: 'applied' }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    if (err instanceof AppError) throw err;

    // Fallback to in-memory
    console.warn('DB application insert failed, using in-memory fallback:', err.message);
    if (!inMemoryApps.has(userId)) inMemoryApps.set(userId, []);
    const apps = inMemoryApps.get(userId);

    const alreadyApplied = apps.find((a) => a.internship_id === internshipId);
    if (alreadyApplied) throw new AppError('You have already applied to this internship.', 409);

    const newApp = {
      id: (appIdCounter++).toString(),
      user_id: userId,
      internship_id: internshipId,
      status: 'applied',
      created_at: new Date().toISOString(),
    };
    apps.push(newApp);
    return newApp;
  }
};

/**
 * Withdraw an application.
 */
const withdrawApplication = async (userId, applicationId) => {
  try {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', applicationId)
      .eq('user_id', userId); // Ensure ownership

    if (error) throw error;
    return true;
  } catch (err) {
    // Fallback
    if (inMemoryApps.has(userId)) {
      const apps = inMemoryApps.get(userId);
      const idx = apps.findIndex((a) => a.id === applicationId);
      if (idx !== -1) {
        apps.splice(idx, 1);
        return true;
      }
    }
    throw new AppError('Application not found.', 404);
  }
};

module.exports = { getUserApplications, applyToInternship, withdrawApplication };
