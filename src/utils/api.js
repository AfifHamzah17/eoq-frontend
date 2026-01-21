import axios from 'axios';
import Storage from './storage';

const apiClient = axios.create({
  baseURL: 'https://eoq-backend-1034091508339.asia-southeast1.run.app/api'
});

// Interceptor Request: Pasang Token otomatis
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

// Interceptor Response: Handle Error 401 (Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      Storage.clearUser();
      // Redirect ke login jika token mati
      window.location.href = '/auth'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;