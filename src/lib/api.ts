import { supabase } from './supabase'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ─── Generic request helper ────────────────────────────────────────────────────

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession()
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  return headers
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers = await getAuthHeaders()
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(json.message || `Request failed: ${res.status}`)
  }

  return json as T
}

// ─── Internship API ────────────────────────────────────────────────────────────

export interface Internship {
  id: string
  title: string
  company: string
  companyLogo: string
  companyColor: string
  location: string
  duration: string
  salary: string
  matchScore: number
  type: string
  skills: string[]
  description: string
  saved: boolean
  applied: boolean
  postedDate: string
}

export interface InternshipsResponse {
  status: string
  results: number
  data: { internships: Internship[] }
}

export interface InternshipResponse {
  status: string
  data: { internship: Internship }
}

export const internshipApi = {
  getAll: (params?: {
    search?: string
    type?: string
    duration?: string
    location?: string
  }) => {
    const qs = new URLSearchParams()
    if (params?.search) qs.set('search', params.search)
    if (params?.type && params.type !== 'All') qs.set('type', params.type)
    if (params?.duration && params.duration !== 'Any') qs.set('duration', params.duration)
    if (params?.location && params.location !== 'Any') qs.set('location', params.location)
    const query = qs.toString() ? `?${qs.toString()}` : ''
    return request<InternshipsResponse>('GET', `/api/internships${query}`)
  },

  getById: (id: string) =>
    request<InternshipResponse>('GET', `/api/internships/${id}`),

  create: (data: Partial<Internship> & { companyId: number }) =>
    request<InternshipResponse>('POST', '/api/internships', data),

  update: (id: string, data: Partial<Internship>) =>
    request<InternshipResponse>('PUT', `/api/internships/${id}`, data),

  delete: (id: string) =>
    request<void>('DELETE', `/api/internships/${id}`),

  toggleSave: (id: string) =>
    request<{ status: string; message: string; data: { saved: boolean } }>(
      'POST',
      `/api/internships/${id}/save`
    ),
}

// ─── AI Assessment API ────────────────────────────────────────────────────────

export interface AIMockQuestion {
  id: string
  category: string
  difficulty: string
  question: string
  timeLimit: number
  tips: string[]
  sampleAnswer: string
}

export interface AIInterviewResponse {
  status: string
  data: {
    questions: AIMockQuestion[]
  }
}

export interface AIEvaluationResponse {
  status: string
  data: {
    aiScore: number
    aiFeedback: string
    sampleAnswer: string
  }
}

export interface AIQuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export interface AIQuizResponse {
  status: string
  data: {
    questions: AIQuizQuestion[]
  }
}

export const aiApi = {
  generateInterview: (category: string, difficulty: string, skill: string) =>
    request<AIInterviewResponse>('POST', '/api/ai/interview/generate', { category, difficulty, skill }),

  evaluateAnswer: (question: string, answer: string) =>
    request<AIEvaluationResponse>('POST', '/api/ai/interview/evaluate', { question, answer }),

  generateQuiz: (skill: string, difficulty: string) =>
    request<AIQuizResponse>('POST', '/api/ai/quiz/generate', { skill, difficulty }),
}
