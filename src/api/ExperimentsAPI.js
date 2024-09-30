import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import ParticipantsAPI from './ParticipantsAPI';
import ScenariosAPI from './ScenariosAPI';
import ActivitiesAPI from './ActivitiesAPI';
import ScenarioExecutionsAPI from './ScenarioExecutionsAPI';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.EXPERIMENTS;
  }

  static dTOFrontToAPI(data){
    const participants_ids = data.participants?.map(e => ({ key: 'participant_id', value: e.id }));
    console.log(participants_ids);
    return {
      experiment_name: data.name,
      additional_properties: [
        ...(data.additionalParameters?.map(e => ({ key: e.name, value: e.value })) || []),
        {
          key: 'description',
          value: data.description,
        },
        {
          key: 'creator',
          value: data.creator,
        },
        {
          key: 'created_at',
          value: data.created_at,
        },
        {
          key: 'footnote',
          value: data.footnote,
        },
        ...(participants_ids || []),
      ],
    };
  }

  static dTOAPIToFront(data){
    //console.log(data);
    const participants_ids = data.additional_properties.filter(
      param => 'participant_id' === param.key,
    ).map(e => e.value);
    return {
      id: data.id,
      name: data.experiment_name,
      description: data.additional_properties.find(param => param.key === 'description').value,
      creator: data.additional_properties.find(param => param.key === 'creator').value,
      created_at: data.additional_properties.find(param => param.key === 'created_at').value,
      footnote: data.additional_properties.find(param => param.key === 'footnote').value,
      participants_ids: participants_ids,
      additionalParameters: data.additional_properties.filter(
        param => !['creator', 'description', 'created_at', 'footnote', 'participant_id'].includes(param.key),
      ).map(e => {return { ...e, name: e.key };}),
      scenarios: data.scenarios?.map(e => ScenariosAPI.dTOAPIToFront(e)),
      scenarioExecutions: data.scenarios?.map(e => ScenarioExecutionsAPI.dTOAPIToFront(e)),
    };
    
  }

  static show(id, depth = 2) {
    return super.show(id, depth).then(async ({ data }) => {
      var participants = [];
      if (data.participants_ids.length !== 0){
        participants = Promise.all(data.participants_ids?.map( participant_id => {
          return ParticipantsAPI.show(participant_id).then(({ data }) => data);
        }));
      }


      if (data.scenarios){
        const activities = await ActivitiesAPI.index().then(({ data }) => data);
        for (const scenario of data.scenarios) {
          var scenarioActivities = [];
          for (const activityId of scenario.activity_ids){
            scenarioActivities.push(activities.find(param => param.id === activityId));
          }
          scenario.activities = scenarioActivities;
        }
      }
      return {
        ...data,
        participants: await participants,
      };
    }).then((finalData) => {
      return { data: finalData };
    });
  }
}