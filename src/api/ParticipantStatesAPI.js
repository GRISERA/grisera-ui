import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.PARTICIPANT_STATES;
  }

  static dTOFrontToAPI(data){
    return {
      participant_id: data.participant_id,
      personality_ids: data.personality_ids,
      appearance_ids: data.appearance_ids,
    };
  }

  static dTOAPIToFront(data){
    return {};
  }
}