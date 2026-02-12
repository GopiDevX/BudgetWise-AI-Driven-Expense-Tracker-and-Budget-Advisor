// API Configuration
export const API_BASE_URL = 'http://localhost:8081/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  SIGNIN: `${API_BASE_URL}/auth/signin`,
  SIGNUP: `${API_BASE_URL}/auth/signup`,
  VALIDATE: `${API_BASE_URL}/auth/validate`
};

// Common headers
export const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});

export const getHeaders = () => ({
  'Content-Type': 'application/json'
});
