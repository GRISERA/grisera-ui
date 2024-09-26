import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.EXPERIMENTS;
  }

  static dTOFrontToAPI(data){
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
      ],
    };
  }

  static dTOAPIToFront(data){
    return {
      id: data.id,
      name: data.experiment_name,
      description: data.additional_properties.find(param => param.key === 'description').value,
      creator: data.additional_properties.find(param => param.key === 'creator').value,
      created_at: data.additional_properties.find(param => param.key === 'created_at').value,
      footnote: data.additional_properties.find(param => param.key === 'footnote').value,
      additionalParameters: data.additional_properties.filter(
        param => !['creator', 'description', 'created_at', 'footnote'].includes(param.key),
      ).map(e => {return { ...e, name: e.key };}),
    };
  }

}