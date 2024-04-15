import BaseAPI from '@/api/BaseAPI';
import DatabaseName from '@/const/relations/DatabaseName';
import ModelType from '@/const/relations/ModelType';

export default class extends BaseAPI {
  static getBasePath() {
    return DatabaseName.PARTICIPANT_STATES;
  }

  static getModelType() {
    return ModelType.PARTICIPANT_STATE;
  }
}