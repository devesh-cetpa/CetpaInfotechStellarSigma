import axios from 'axios';
import { environment } from '@/config';
import { getSessionItem, removeSessionItem } from '@/lib/helperFunction';
import toast from 'react-hot-toast';
import logger from '@/lib/logger';

// Utility function for getting the token
const getAccessToken = () => getSessionItem('token');

// Creating Axios instance
const axiosInstance = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    config.headers['DeviceType'] = 'web';
    return config;
  },
  (error) => {
    logger.error(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if we're already on the login page to prevent infinite loops
    const isLoginPage = window.location.pathname.includes('/login');
    
    if (error.code === 'ERR_NETWORK') {
      // Only redirect if we're not already on the login page
      if (!isLoginPage) {
        toast.error('Network error. Please check your connection and try again.');
        removeSessionItem('token');
        removeSessionItem('userData');
        setTimeout(() => {
          window.location.href = environment.logoutUrl;
        }, 500);
      } else {
        // Just show a network error message without redirecting if already on login page
        toast.error('Network error. Please check your connection and try again.');
      }
    }

    // Make sure error.response exists before accessing its status
    if (error.response && error.response.status === 401) {
      // Only redirect if we're not already on the login page
      if (!isLoginPage) {
        toast.error('Authorization failed. Your session has expired. Redirecting to login...');
        removeSessionItem('token');
        removeSessionItem('userData');
        setTimeout(() => {
          window.location.href = environment.logoutUrl;
        }, 500);
      } else {
        // Just show an auth error message without redirecting if already on login page
        toast.error('Authorization failed. Please check your credentials.');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
