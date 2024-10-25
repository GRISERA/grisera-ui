import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.DATASETS;
  }

  static getDatasetName() {
    return '';
  }

  static dTOFrontToAPI(data){
    return {
      id: data.id,
      name: data.name,
      creator: data.creator,
      rights: data.rights,
      date: data.date,
      description: data.description,
      additional_properties: data.additional_properties,
    };
  }

  static dTOAPIToFront(data){
    return {
      id: data.id,
      name: data.name,
      creator: data.creator,
      rights: data.rights,
      date: data.date,
      description: data.description,
      additional_properties: data.additional_properties,
    };
  }
}
