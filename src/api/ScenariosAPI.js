import BaseAPI from '@/api/BaseAPI';
import ModelType from '@/const/relations/ModelType';

export default class extends BaseAPI {
  static getBasePath() {
    return 'scenarios';
  }

  static getModelType() {
    return ModelType.SCENARIO;
  }
}