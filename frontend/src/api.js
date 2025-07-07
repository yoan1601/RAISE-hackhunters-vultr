import axios from 'axios';

// Create a dedicated axios client with a baseURL
const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api',
});

export default apiClient;