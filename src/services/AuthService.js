import axios from 'axios';
import config from '../../config.js';
import LS from '@/storage/LS.js';

const authService = axios.create({
  baseURL: config.authUrl,
});

export default {
  register(user, password) {
    return authService.post('/register', {
      username: user,
      password: password,
    });
  },

  login(user, password) {
    return authService.post('/login', {
      username: user,
      password: password,
    });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    LS.clear('user');
    LS.clear('dataset');
  },

  isAuthenticated() {
    return localStorage.getItem('token') !== null && Date.now() < localStorage.getItem('tokenExpiration'); 
  },
};