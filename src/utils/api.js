// src/utils/api.js
import axios from 'axios';
import Storage from './storage';

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    

    if (error.response && error.response.status === 401) {
      
      if (error.config.url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      Storage.clearUser();
      window.location.href = '/'; 
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;