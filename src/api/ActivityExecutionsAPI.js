import BaseAPI2 from '@/api/BaseAPI';
import DatabaseName from '@/const/relations/DatabaseName';
import ActivitiesAPI from './ActivitiesAPI';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.ACTIVITY_EXECUTIONS;
  }

  static dTOFrontToAPI(data){
    return {};
  }

  static dTOAPIToFront(data){
    return {
      id: data.id,
      name: data.additional_properties?.find(param => param.key === 'name').value,
      description: data.additional_properties?.find(param => param.key === 'description').value,
      activity: data.activity?.map(e => ActivitiesAPI.dTOAPIToFront(e)),
      participations: data.participations,
      arrangement_id: data.arrangement_id,
    };
  }
}
