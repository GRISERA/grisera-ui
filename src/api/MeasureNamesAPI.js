import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.MEASURE_NAMES;
  }

  static dTOFrontToAPI(data){
    return {
      name: data.name,
      type: data.source,
    };
  }

  static dTOAPIToFront(data){
    return {
      id: data.id,
      name: data.name,
      source: data.type,
    };
  }
}