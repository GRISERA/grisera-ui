import { apiService } from '@/api/BaseAPI2';

export default class ImportAPI {
  /**
   * Upload file using multipart/form-data
   * @param {File} file - The file to upload (owl or json)
   * @param {string} datasetId - Dataset ID
   * @param {string} importType - Type of import (owl or json)
   * @param {string} description - Optional description
   * @param {string|null} experimentId - Optional experiment ID
   */
  static uploadFile(file, datasetId, importType, description = '', experimentId = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dataset_id', datasetId);
    formData.append('import_type', importType);
    if (description) {
      formData.append('description', description);
    }
    if (experimentId) {
      formData.append('experiment_id', experimentId);
    }

    return apiService.post('/api/v1/import/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Upload data using JSON
   * @param {Object} importData - Import data object
   */
  static uploadData(importData) {
    return apiService.post('/api/v1/import/upload', importData);
  }

  /**
   * Get import status
   * @param {string} importId - Import ID
   * @param {string} datasetId - Dataset ID
   */
  static getStatus(importId, datasetId) {
    return apiService.get(`/api/v1/import/status/${importId}?dataset_id=${datasetId}`);
  }

  /**
   * Health check for import service
   */
  static healthCheck() {
    return apiService.get('/api/v1/import/health');
  }

  /**
   * Get all imports for a specific dataset
   * @param {string} datasetId - Dataset ID
   */
  static getImportsByDataset(datasetId) {
    return apiService.get(`/api/v1/import/dataset/${datasetId}`);
  }
} 