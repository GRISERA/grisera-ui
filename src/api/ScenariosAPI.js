import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import ActivitiesAPI from './ActivitiesAPI';


export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.SCENARIOS;
  }

  static dTOFrontToAPI(data){
    //console.log(data);
    const test = {
      experiment_id: data.experiment,
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
        ...(data.activities?.map(e => ({ key: 'activity_id', value: e.id })) || []),
      ],
    };
    //console.log(test);
    return test;
  }

  static dTOAPIToFront(data){
    //console.log(data);
    const activities_ids = data.additional_properties?.filter(
      param => 'activity_id' === param.key,
    ).map(e => e.value);
    return {
      id: data.id,
      name: data.additional_properties?.find(param => param.key === 'name').value,
      description: data.additional_properties?.find(param => param.key === 'description').value,
      activity_ids: activities_ids,
      additional_properties: data.additional_properties.filter(
        param => !['name', 'description', 'activity_id'].includes(param.key),
      ).map(e => {return { ...e, name: e.key };}),
    };
  }

  static show(id, depth = 0) {
    return super.show(id, depth).then(async ({ data }) => {
      console.log(data);
      if (data.activity_ids.length !== 0){
        const activities = await ActivitiesAPI.index().then(({ data }) => data);
        data.activities = [];
        for (const activityId of data.activity_ids){
          data.activities.push(activities.find(param => param.id === activityId));
        }
      }
      return {
        ...data,
      };
    }).then((finalData) => {
      return { data: finalData };
    });
  }
}