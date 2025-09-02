import { apiService } from '@/api/BaseAPI2';

export default class ExportAPI {
  /**
   * Start export process
   * @param {Object} exportData - Export configuration
   */
  static startExport(exportData) {
    return apiService.post('/export/start', exportData);
  }

  /**
   * Get export status
   * @param {string} exportId - Export ID
   * @param {string} datasetId - Dataset ID
   */
  static getStatus(exportId, datasetId) {
    return apiService.get(`/export/status/${exportId}?dataset_id=${datasetId}`);
  }

  /**
   * Get all exports for a specific dataset
   * @param {string} datasetId - Dataset ID
   */
  static getExportsByDataset(datasetId) {
    return apiService.get(`/export/list?dataset_id=${datasetId}`);
  }

  /**
   * Download export file
   * @param {string} exportId - Export ID
   * @param {string} datasetId - Dataset ID
   */
  static downloadExport(exportId, datasetId) {
    return apiService.get(`/export/download/${exportId}?dataset_id=${datasetId}`);
  }

  /**
   * Get supported export formats
   */
  static getSupportedFormats() {
    return apiService.get('/export/formats');
  }

  /**
   * Get supported export scopes
   */
  static getSupportedScopes() {
    return apiService.get('/export/scopes');
  }

  /**
   * Health check for export service
   */
  static healthCheck() {
    return apiService.get('/export/health');
  }
}

