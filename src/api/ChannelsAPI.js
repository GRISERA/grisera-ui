import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.CHANNELS;
  }

  static dTOFrontToAPI(data){
    return {
      type: data.name,
      description: data.description,
    };
  }

  static dTOAPIToFront(data){
    const keyValue = data.type.split(' ').lenght > 1 ? data.type.split(' ').map((word, index) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('') : data.type;
    return {
      id: data.id,
      key: 'channel' + keyValue,
      name: data.type,
      description: data.description,
    };
  }
}