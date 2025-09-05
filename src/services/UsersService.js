import axios from 'axios';
import config from '../../config.js';
import AuthService from '@/services/AuthService';

const usersService = axios.create({
  baseURL: config.authUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

usersService.interceptors.request.use(
    async config => {
      try {
        const token = await AuthService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
);

export default {
  getUsers() {
    return usersService.get('/users');
  },
};