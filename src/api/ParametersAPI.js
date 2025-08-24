import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.PARAMETERS;
  }

  static getReturnValues() {
    return 'parameters';
  }

  static dTOFrontToAPI(data) {
    return {
      name: data.name,
      key: data.key,
      type: data.type,
      options: data.options || [],
    };
  }

  static dTOAPIToFront(data) {
    if (!data) return;
    
    return {
      id: data.id,
      name: data.name,
      key: data.key,
      type: data.type,
      options: data.options || [],
      dataset_id: data.dataset_id,
    };
  }
}