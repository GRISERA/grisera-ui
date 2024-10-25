import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.ARRANGEMENTS;
  }

  static dTOFrontToAPI(data){
    return {};
  }

  static dTOAPIToFront(data){
    return {
        id: data.id,
        arrangementType: data.arrangement_type,
        arrangementDistance: data.arrangement_distance?.split(' ').map((word, index) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
          }).join(' '),
    };
  }
}