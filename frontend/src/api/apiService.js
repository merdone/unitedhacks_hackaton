import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ── Users ────────────────────────────────────────────────────────────────────

export const usersAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};

// ── Exercises ────────────────────────────────────────────────────────────────

export const exercisesAPI = {
  list: () => api.get('/exercises/'),
  create: (data) => api.post('/exercises/', data),
};

// ── Templates ────────────────────────────────────────────────────────────────

export const templatesAPI = {
  list: () => api.get('/templates/'),
  create: (data) => api.post('/templates/', data),
};

// ── Workouts ─────────────────────────────────────────────────────────────────

export const workoutsAPI = {
  start: (data) => api.post('/workouts/start', data),
  addLog: (sessionId, data) => api.post(`/workouts/${sessionId}/log`, data),
  complete: (sessionId, data) => api.post(`/workouts/${sessionId}/complete`, data),
};

// ── Readiness ────────────────────────────────────────────────────────────────

export const readinessAPI = {
  submit: (data) => api.post('/readiness/', data),
  getLatest: () => api.get('/readiness/latest'),
};

// ── AI ───────────────────────────────────────────────────────────────────────

export const aiAPI = {
  getRecommendation: () => api.post('/ai/recommendation'),
};

// ── Voice ────────────────────────────────────────────────────────────────────

export const voiceAPI = {
  transcribe: (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    return api.post('/voice/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ── Stats ────────────────────────────────────────────────────────────────────

export const statsAPI = {
  get: (days = 30) => api.get(`/stats/?days=${days}`),
};

export default api;
