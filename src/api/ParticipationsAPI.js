import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.PARTICIPATIONS;
  }

  static dTOFrontToAPI(data){
    return {
        activity_execution_id: data.activity_execution_id,
        participant_state_id: data.participant_state_id,
    };
  }

  static dTOAPIToFront(data){
    return {};
  }
}