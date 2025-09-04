import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://localhost:5000/api' // <- adjust if your API base differs
  baseURL: 'https://vehicle-fleetlink-system-server.vercel.app/api'
});

// attach token automatically
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
