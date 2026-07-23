import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Interceptor to inject JWT token into authorization header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear token
      localStorage.removeItem('vms_token');
      localStorage.removeItem('vms_user');
    }
    return Promise.reject(error);
  }
);

export default API;
