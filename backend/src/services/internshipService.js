const { supabase } = require('../config/supabase');
const AppError = require('../utils/appError');

/**
 * Calculates human-readable posted date string from a timestamp.
 */
const getPostedDateString = (createdAt) => {
  const createdDate = new Date(createdAt);
  const diffTime = Math.abs(new Date() - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return 'Today';
  if (diffDays === 2) return '1 day ago';
  return `${diffDays - 1} days ago`;
};

// In-memory fallback for saved internships since the DB table is not present
const inMemorySaves = new Map(); // profileId -> Set of internshipIds (as strings)

/**
 * Maps raw database response object to the format expected by the frontend.
 */
const getSkillsForTitle = (title) => {
  const t = title.toLowerCase();
  if (t.includes('frontend') || t.includes('react')) return ['React', 'TypeScript', 'CSS', 'Next.js'];
  if (t.includes('design') || t.includes('ux') || t.includes('ui')) return ['Figma', 'UI/UX', 'Prototyping'];
  if (t.includes('data') || t.includes('science') || t.includes('analyst')) return ['Python', 'SQL', 'Pandas', 'Tableau'];
  if (t.includes('ai') || t.includes('ml') || t.includes('machine') || t.includes('deep')) return ['Python', 'PyTorch', 'TensorFlow', 'NLP'];
  return ['React', 'TypeScript', 'Node.js', 'PostgreSQL'];
};

const formatInternshipResponse = (job, savedIds = new Set(), appliedIds = new Set()) => {
  const idStr = job.id.toString();
  return {
    id: idStr,
    title: job.title,
    company: job.company ? job.company.name : 'Unknown Company',
    companyLogo: job.company && job.company.logo_url ? job.company.logo_url : (job.company ? job.company.name.charAt(0) : 'C'),
    companyColor: '#4F46E5', // Set default company color
    location: job.location,
    duration: job.duration,
    salary: job.salary || 'Competitive',
    matchScore: 85, // Default match score
    type: job.work_type || 'Software Engineering',
    skills: getSkillsForTitle(job.title),
    description: job.description,
    saved: savedIds.has(idStr),
    applied: appliedIds.has(idStr),
    postedDate: getPostedDateString(job.created_at)
  };
};

/**
 * Fetch all internships matching optional filters.
 */
const getAll = async (filters = {}, profileId = null) => {
  let query = supabase
    .from('internships')
    .select('*, company:companies(*)');

  // Filter by job type (mapped to work_type in DB)
  if (filters.type && filters.type !== 'All') {
    query = query.eq('work_type', filters.type);
  }

  // Filter by duration
  if (filters.duration && filters.duration !== 'Any') {
    query = query.eq('duration', filters.duration);
  }

  // Filter by location
  if (filters.location && filters.location !== 'Any') {
    if (filters.location.toLowerCase() === 'remote') {
      query = query.ilike('location', '%remote%');
    } else {
      query = query.ilike('location', `%${filters.location}%`);
    }
  }

  // Filter by search query (checks title and description)
  if (filters.search) {
    const searchVal = `%${filters.search}%`;
    query = query.or(`title.ilike.${searchVal},description.ilike.${searchVal}`);
  }

  // Execute query
  const { data: rawInternships, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;

  // Retrieve user bookmarks and applications if logged in
  let savedIds = new Set();
  let appliedIds = new Set();

  if (profileId) {
    // 1. Get in-memory saves
    if (inMemorySaves.has(profileId)) {
      savedIds = inMemorySaves.get(profileId);
    }
    
    // 2. Query applications from DB (user_id field)
    try {
      const { data: appliedRes, error: appliedErr } = await supabase
        .from('applications')
        .select('internship_id')
        .eq('user_id', profileId);
        
      if (!appliedErr && appliedRes) {
        appliedRes.forEach(item => appliedIds.add(item.internship_id.toString()));
      }
    } catch (e) {
      console.error('Error fetching applications:', e);
    }
  }

  // Format response matching frontend expectations
  return (rawInternships || []).map(job => formatInternshipResponse(job, savedIds, appliedIds));
};

/**
 * Fetch internship by ID.
 */
const getById = async (id, profileId = null) => {
  const { data: job, error } = await supabase
    .from('internships')
    .select('*, company:companies(*)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new AppError('Internship listing not found.', 404);
    }
    throw error;
  }

  let savedIds = new Set();
  let appliedIds = new Set();

  if (profileId) {
    if (inMemorySaves.has(profileId) && inMemorySaves.get(profileId).has(id.toString())) {
      savedIds.add(id.toString());
    }

    try {
      const { data: appliedRes, error: appliedErr } = await supabase
        .from('applications')
        .select('internship_id')
        .eq('user_id', profileId)
        .eq('internship_id', id);

      if (!appliedErr && appliedRes && appliedRes.length > 0) {
        appliedIds.add(id.toString());
      }
    } catch (e) {
      console.error('Error fetching application status:', e);
    }
  }

  return formatInternshipResponse(job, savedIds, appliedIds);
};

/**
 * Create a new internship listing.
 */
const create = async (internshipData) => {
  const { data: job, error } = await supabase
    .from('internships')
    .insert([{
      company_id: internshipData.companyId,
      title: internshipData.title,
      description: internshipData.description,
      location: internshipData.location,
      work_type: internshipData.type,
      duration: internshipData.duration,
      salary: internshipData.salary
    }])
    .select('*, company:companies(*)')
    .single();

  if (error) throw error;
  return formatInternshipResponse(job);
};

/**
 * Update an existing internship listing.
 */
const update = async (id, internshipData) => {
  // Check if internship exists first
  await getById(id);

  // Update object
  const updatePayload = {};
  if (internshipData.companyId) updatePayload.company_id = internshipData.companyId;
  if (internshipData.title) updatePayload.title = internshipData.title;
  if (internshipData.description) updatePayload.description = internshipData.description;
  if (internshipData.location) updatePayload.location = internshipData.location;
  if (internshipData.type) updatePayload.work_type = internshipData.type;
  if (internshipData.duration) updatePayload.duration = internshipData.duration;
  if (internshipData.salary) updatePayload.salary = internshipData.salary;

  const { data: job, error } = await supabase
    .from('internships')
    .update(updatePayload)
    .eq('id', id)
    .select('*, company:companies(*)')
    .single();

  if (error) throw error;
  return formatInternshipResponse(job);
};

/**
 * Delete an internship listing.
 */
const remove = async (id) => {
  // Ensure it exists
  await getById(id);

  const { error } = await supabase
    .from('internships')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

/**
 * Toggle bookmark/save for an internship listing.
 */
const toggleSave = async (id, profileId) => {
  // Ensure it exists
  await getById(id);

  if (!inMemorySaves.has(profileId)) {
    inMemorySaves.set(profileId, new Set());
  }

  const userSaves = inMemorySaves.get(profileId);
  const idStr = id.toString();

  if (userSaves.has(idStr)) {
    userSaves.delete(idStr);
    return { saved: false };
  } else {
    userSaves.add(idStr);
    return { saved: true };
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  toggleSave
};
