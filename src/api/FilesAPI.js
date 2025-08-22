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

  static index() {
    return apiService.get(`/${ this.getBasePath() }?${ this.getDatasetName() }`).then(({ data }) => {
      // Jeśli dane są już w odpowiedniej formie, zwróć je bezpośrednio
      const processedData = Array.isArray(data) ?
        data.map(e => this.dTOAPIToFront(e)) :
        (
          data.files || data[this.getBasePath()] || data || []
        ).map(e => this.dTOAPIToFront(e));

      return { data: processedData };
    });
  }

  static upload(formData) {
    const file = formData.get('file');

    // Użyj nazwy z formularza lub domyślnej (bez rozszerzenia)
    const customName = formData.get('name');
    const fileName = customName || file.name.replace(/\.[^/.]+$/, '');

    // Archiwum
    const archiveExtensions = ['zip', 'tar', 'gz'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isArchive = archiveExtensions.includes(fileExtension);

    // Pobierz ID datasetu bezpośrednio
    const datasetId = this.getDatasetName().split('=')[1];

    // Przygotuj poprawne dane do wysłania
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('name', fileName);
    uploadData.append('dataset_id', datasetId);
    uploadData.append('is_archive', isArchive);

    return apiService.post(`/${ this.getBasePath() }/upload?${ this.getDatasetName() }`, uploadData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static download(id) {
    return apiService.get(`/${ this.getBasePath() }/${ id }/download?${ this.getDatasetName() }`);
  }

  static preview(id) {
    return apiService.get(`/${ this.getBasePath() }/${ id }/preview?${ this.getDatasetName() }`, {
      responseType: 'blob',
    });
  }

  static getPreviewUrl(id) {
    return apiService.get(`/${ this.getBasePath() }/${ id }/preview-url?${ this.getDatasetName() }`);
  }
}