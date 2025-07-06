import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000',
});

export const checkBackendHealth = () => client.get('/health');
