import LocalStorageService from '@/storage/LocalStorageService';

export default class BaseAPI {
  static getBasePath() {
    return '';
  }

  static getModelType() {
    return '';
  }

  static index() {
    return LocalStorageService.get(this.getBasePath(), undefined, this.getModelType());
  }

  static show(id) {
    return LocalStorageService.get(this.getBasePath(), id, this.getModelType());
  }

  static store(data) {
    return LocalStorageService.post(this.getBasePath(), data, this.getModelType());
  }

  static update(data) {
    return LocalStorageService.update(this.getBasePath(), data.id, data, this.getModelType());
  }

  static delete(id) {
    return LocalStorageService.delete(this.getBasePath(), id, this.getModelType());
  }

  static count() {
    return LocalStorageService.count(this.getBasePath(), this.getModelType());
  }
}