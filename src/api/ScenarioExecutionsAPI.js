import BaseAPI2, { apiService } from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import ActivityExecutionsAPI from './ActivityExecutionsAPI';

//this class doesn't exist on backend and so all calls are to ScenarioApi and mapping based on them
export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.SCENARIOS;
  }

  static dTOFrontToAPI(data){
    if(data.activityExecutions.length === 0)
      return {};

    var activity_executions = data.activityExecutions?.map(e => ActivityExecutionsAPI.dTOFrontToAPI(e));
    activity_executions[0].additional_properties.push({
      key: 'scenarioExecutionName',
      value: data.name,
    });
    return {
      activity_executions: activity_executions,
    };
  }

  static dTOAPIToFront(data){
    //console.log(data);
    if(data.activity_executions.length === 0){
      return {};
    }
    if(data.activity_executions.some(item => Array.isArray(item))){
      return data.activity_executions?.map(activity_executions => {
        return this.dTOAPIToFront({ ...data, activity_executions: activity_executions });
      }) || [];
    }

    const activityExecutions = data.activity_executions?.map(e => ActivityExecutionsAPI.dTOAPIToFront(e));
    const additional_properties = activityExecutions?.map(activityExecution => activityExecution.additionalParameters).flat();// additional_properties of scenario executions are stored in one of their activity executions
    return {
      id: activityExecutions[0].id,
      name: additional_properties?.find(param => param.key === 'scenarioExecutionName')?.value,
      activityExecutions: activityExecutions,
      scenario: data.additional_properties?.find(param => param.key === 'name').value,
      additionalParameters: additional_properties.filter(
        param => !['scenarioExecutionName'].includes(param.key),
      ).map(e => {return { ...e, name: e.key };}),
    };
  }

  static store(id, data) {
    //console.log('Store: ', data);
    //console.log('Store after dto: ', this.dTOFrontToAPI(data));
    return apiService.post(`/${this.getBasePath()}/${id}?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
  }
}
