import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.MODALITIES;
  }

  static dTOFrontToAPI(data){
    return {
      modality: data.name,
    };
  }

  static dTOAPIToFront(data){
    const formated = data.modality.charAt(0).toUpperCase() + data.modality.slice(1) || '';
    return {
      id: data.id,
      key: 'modality' + data.modality.split(' ').map((word, index) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(''),
      name: formated,
      description: formated,
    };
  }
}