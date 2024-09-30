import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import ActivityExecutionsAPI from './ActivityExecutionsAPI';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.SCENARIOS;
  }

  static dTOFrontToAPI(data){
    return {
      additional_properties: [
        ...(data.additionalParameters?.map(e => {return { key: e.name, value: e.value };}) || []),
        {
          key: 'name',
          value: data.name,
        },
        {
          key: 'description',
          value: data.description,
        },
        {
          key: 'scenario',
          value: data.description,
        },
        ...(data.activities?.map(e => ({ key: 'activity_id', value: e.id })) || []),
      ],
    };
  }

  static dTOAPIToFront(data){
    //console.log(data);
    return {
      id: data.id,
      name: data.additional_properties?.find(param => param.key === 'name')?.value,
      description: data.additional_properties?.find(param => param.key === 'description')?.value,
      activityExecutions: data.activity_executions?.map(e => ActivityExecutionsAPI.dTOAPIToFront(e)),
      scenario: data.additional_properties?.find(param => param.key === 'scenario')?.value,
      additional_properties: data.additional_properties.filter(
        param => !['name', 'description', 'scenario'].includes(param.key),
      ).map(e => {return { ...e, name: e.key };}),
    };
  }


}
