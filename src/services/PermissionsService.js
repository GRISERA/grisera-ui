import axios from 'axios';
import config from '../../config.js';

const permissionsService = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token'),  
  },
});

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