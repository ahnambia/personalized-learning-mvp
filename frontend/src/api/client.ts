import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For httpOnly cookies
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Try to refresh token
        const response = await apiClient.post('/auth/refresh')
        const { access_token } = response.data
        localStorage.setItem('access_token', access_token)
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  
  signup: (email: string, password: string, display_name: string) =>
    apiClient.post('/auth/signup', { email, password, display_name }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  refresh: () =>
    apiClient.post('/auth/refresh'),
}

// User API
export const userAPI = {
  getProfile: () =>
    apiClient.get('/users/me'),
  
  updateProfile: (data: { display_name?: string; learning_goals?: string; preferences?: Record<string, unknown> }) =>
    apiClient.put('/users/profile', data),
}

// Skills API
export const skillsAPI = {
  getSkills: (domain?: string) =>
    apiClient.get('/skills', { params: { domain } }),
  
  getSkill: (id: number) =>
    apiClient.get(`/skills/${id}`),
  
  createSkill: (data: { name: string; description?: string; category?: string; difficulty?: number }) =>
    apiClient.post('/skills', data),
}

// Content API
export const contentAPI = {
  getContent: (params?: { q?: string; type?: string; skill_id?: number; min_diff?: number; max_diff?: number; skip?: number; limit?: number }) =>
    apiClient.get('/content', { params }),
  
  getContentItem: (id: number) =>
    apiClient.get(`/content/${id}`),
  
  createContent: (data: { title: string; type: string; data?: Record<string, unknown>; skill_id: number; duration_minutes?: number }) =>
    apiClient.post('/content', data),
}

// Quizzes API
export const quizzesAPI = {
  getQuizzes: (skill_id?: number) =>
    apiClient.get('/quizzes', { params: { skill_id } }),
  
  getQuiz: (id: number) =>
    apiClient.get(`/quizzes/${id}`),
}

// Attempts API
export const attemptsAPI = {
  startAttempt: (quiz_id: number) =>
    apiClient.post('/attempts/start', { quiz_id }),
  
  saveResponse: (attempt_id: number, question_id: number, answer: string) =>
    apiClient.post(`/attempts/${attempt_id}/response`, { question_id, answer }),
  
  submitAttempt: (attempt_id: number) =>
    apiClient.post(`/attempts/${attempt_id}/submit`),
}

// Mastery API
export const masteryAPI = {
  getMastery: () =>
    apiClient.get('/mastery'),
}

export default apiClient
