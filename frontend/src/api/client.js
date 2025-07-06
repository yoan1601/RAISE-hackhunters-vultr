import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8000', // Adjust this to your backend URL
});

export const checkBackendHealth = () => client.get('/health');
