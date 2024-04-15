import BaseAPI from '@/api/BaseAPI';
import DatabaseName from '@/const/relations/DatabaseName';
import ModelType from '@/const/relations/ModelType';

export default class extends BaseAPI {
  static getBasePath() {
    return DatabaseName.LIFE_ACTIVITIES;
  }

  static getModelType() {
    return ModelType.LIFE_ACTIVITY;
  }
}