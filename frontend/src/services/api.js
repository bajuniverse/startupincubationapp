import axiosInstance from '../axiosConfig';

// Auth Services
export const authService = {
  login: (credentials) => axiosInstance.post('/api/auth/login', credentials),
  register: (userData) => axiosInstance.post('/api/auth/register', userData),
  getProfile: (token) => axiosInstance.get('/api/auth/profile', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateProfile: (token, data) => axiosInstance.put('/api/auth/profile', data, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

// Task Services
export const taskService = {
  getAll: (token) => axiosInstance.get('/api/tasks', {
    headers: { Authorization: `Bearer ${token}` }
  }),
  create: (token, data) => axiosInstance.post('/api/tasks', data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (token, id, data) => axiosInstance.put(`/api/tasks/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  delete: (token, id) => axiosInstance.delete(`/api/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};