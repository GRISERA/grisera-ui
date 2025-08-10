import BaseAPI2, { apiService } from '@/api/BaseAPI2';

export default class extends BaseAPI2 {
  static getBasePath() {
    return 'files';
  }

  static dTOFrontToAPI(data) {
    return {
      id: data.id,
      filename: data.filename,
      original_filename: data.originalFilename,
      name: data.name,
      size: data.size,
      content_type: data.contentType,
      dataset_id: data.datasetId,
      uploaded_at: data.uploadedAt,
    };
  }

  static dTOAPIToFront(data) {
    return {
      id: data.id,
      filename: data.filename,
      originalFilename: data.original_filename,
      name: data.name,
      size: data.size,
      contentType: data.content_type,
      datasetId: data.dataset_id,
      uploadedAt: data.uploaded_at,
    };
  }

  static upload(file, name, datasetId) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    if (datasetId) {
      formData.append('dataset_id', datasetId);
    }
    
    return apiService.post(`/${this.getBasePath()}/upload?${this.getDatasetName()}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static download(id) {
    return apiService.get(`/${this.getBasePath()}/${id}/download?${this.getDatasetName()}`);
  }

  static preview(id) {
    return apiService.get(`/${this.getBasePath()}/${id}/preview?${this.getDatasetName()}`, {
      responseType: 'blob',
    });
  }
}