import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import ParticipantsAPI from './ParticipantsAPI';

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
    const participants_ids = data.additional_properties.filter(
      param => 'participant_id' === param.key,
    ).map(e => e.value);
    return {
      id: data.id,
      test: 'akk',
      name: data.experiment_name,
      description: data.additional_properties.find(param => param.key === 'description').value,
      creator: data.additional_properties.find(param => param.key === 'creator').value,
      created_at: data.additional_properties.find(param => param.key === 'created_at').value,
      footnote: data.additional_properties.find(param => param.key === 'footnote').value,
      participants_ids: participants_ids,
      additionalParameters: data.additional_properties.filter(
        param => !['creator', 'description', 'created_at', 'footnote', 'participant_id'].includes(param.key),
      ).map(e => {return { ...e, name: e.key };}),
    };
  }

  static show(id, depth = 0) {
    return super.show(id, depth).then(async ({ data }) => {
      var participants = [];
      if (data.participants_ids.length !== 0){
        participants = Promise.all(data.participants_ids?.map( participant_id => {
          return ParticipantsAPI.show(participant_id).then(({ data }) => data);
        }));
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