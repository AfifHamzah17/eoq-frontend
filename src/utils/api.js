import axios from 'axios';
import Storage from './storage';

// PASTIKAN INI YANG AKTIF
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api' 
});

// Interceptor Request
apiClient.interceptors.request.use(
  (config) => {
    const token = Storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Storage.clearUser();
      window.location.href = '/auth'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;