import axios from 'axios';
import config from '../../config.js';

const usersService = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token'),  
  },
});

export default {
  getUsers() {
    return usersService.get('/users');
  },
};