import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('neurolearn_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User APIs
export const userAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  updateSettings: (userId, data) => api.put(`/users/settings/${userId}`, data),
};

// Content APIs
export const contentAPI = {
  getAll: (params) => api.get('/content', { params }),
  getById: (id) => api.get(`/content/${id}`),
  create: (data) => api.post('/content', data),
  getSubjects: () => api.get('/content/subjects/list'),
};

// Learning APIs
export const learningAPI = {
  getRecommendations: (userId) => api.get(`/learning/recommendations/${userId}`),
  getAdaptivePath: (userId) => api.get(`/learning/adaptive-path/${userId}`),
  markComplete: (userId, contentId) => api.post(`/learning/complete/${userId}/${contentId}`),
};

// Interaction APIs
export const interactionAPI = {
  log: (data) => api.post('/interactions/log', data),
  getUserInteractions: (userId, params) => api.get(`/interactions/user/${userId}`, { params }),
  getAnalytics: (userId) => api.get(`/interactions/analytics/${userId}`),
};

export default api;
