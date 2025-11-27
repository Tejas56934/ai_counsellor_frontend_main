// src/api.js
import axios from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 30000,
});

// Global error handling
api.interceptors.response.use(
  res => res,
  err => {
    return Promise.reject(err.response?.data || err.message);
  }
);

export async function askChat(formData) {
  const payload = {
    fullName: formData.fullName,
    email: formData.email,
    mobileNo: formData.mobileNo || null,
    subject: formData.subject,
    message: formData.message,
    context: formData.context
  };

  const resp = await api.post('/chat/ask', payload);
  return resp.data;
}

// -------------------
// Admission Submission
// -------------------
export async function submitAdmission(formData) {
  const resp = await api.post('/new-admission/submit', formData);
  return resp.data;
}

export default api;
