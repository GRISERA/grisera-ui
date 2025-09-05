import axios from 'axios';
import config from '../../config.js';
import AuthService from '@/services/AuthService';

const permissionsService = axios.create({
  baseURL: config.authUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

permissionsService.interceptors.request.use(
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
  add(permission) {
    return permissionsService.post('/permissions', permission);
  },
  update(permissionId, newRole) {
    return permissionsService.put(`/permissions/${permissionId}`, { role: newRole });
  },
  removePermission(permissionId) {
    return permissionsService.delete(`/permissions/${permissionId}`);
  },
  getAll() {
    return permissionsService.get('/permissions');
  },
  getUserPermissions(userId) {
    return permissionsService.get(`/permissions/${userId}`);
  },
  getPermissionsByDatasetId(datasetId) {
    return permissionsService.get(`/permissions/dataset/${datasetId}`);
  },
};