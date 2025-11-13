// src/api.js
import axios from 'axios';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://ai-counsellor-backend-1.onrender.com';

const api = axios.create({
  baseURL: 'https://ai-counsellor-backend-1.onrender.com',
  timeout: 30000,
});

api.interceptors.response.use(
  res => res,
  err => Promise.reject(err.response?.data || err.message)
);

// AI Chat
export async function askChat(message, context = 'Home') {
  const payload = { message, context };
  const resp = await api.post('/chat/ask', payload);
  return resp.data;
}

// Admission Submission
export async function submitAdmission(formData) {
  const resp = await api.post('/admission/submit', formData);
  return resp.data;
}

export default api;
