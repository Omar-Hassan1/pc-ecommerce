import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT access token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unified response handler
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data;
    let message = 'An unexpected network error occurred';
    if (data) {
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        message = data.errors.join('. ');
      } else if (data.message) {
        message = data.message;
      }
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
