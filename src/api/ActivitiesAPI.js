import BaseAPI from '@/api/BaseAPI';
import ModelType from '@/const/relations/ModelType';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI {
  static getBasePath() {
    return DatabaseName.ACTIVITIES;
  }

  static getModelType() {
    return ModelType.ACTIVITY;
  }
}
