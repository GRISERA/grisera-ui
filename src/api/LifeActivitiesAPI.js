import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.LIFE_ACTIVITIES;
  }

  static dTOFrontToAPI(data){
    return {
      life_activity: data.name,
    };
  }

  static dTOAPIToFront(data){
    const formated = data.life_activity.charAt(0).toUpperCase() + data.life_activity.slice(1) || '';
    return {
      id: data.id,
      key: 'lifeActivity' + data.life_activity.split(' ').map((word, index) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(''),
      name: formated,
      description: formated,
    };
  }
}