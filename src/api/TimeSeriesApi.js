import BaseAPI from '@/api/BaseAPI';
import ModelType from '@/const/relations/ModelType';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI {
  static getBasePath() {
    return DatabaseName.TIME_SERIES;
  }

  static getModelType() {
    return ModelType.TIME_SERIE;
  }
}