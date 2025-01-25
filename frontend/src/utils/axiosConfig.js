import axios from 'axios';
import { authService } from '../services/authService';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error.response?.status === 401 || error.response?.status === 403) &&
        !error.config.url.includes('/api/matches') && 
        !error.config.url.includes('/api/auth')) {
      console.log('Token expired or invalid, logging out...');
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios; 