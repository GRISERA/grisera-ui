import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.ACTIVITIES;
  }

  static dTOFrontToAPI(data){
    const typeMapping = {
      'Individual': 'individual',
      'Two persons activity': 'two-people',
      'Group activity': 'group',
    };

    return {
      activity: typeMapping[data.type],
      additional_properties: [
        ...data.additionalParameters,
        {
          key: 'name',
          value: data.name,
        },
        {
          key: 'description',
          value: data.description,
        },
      ],
    };
  }

  static dTOAPIToFront(data){
    const typeMapping = {
      'individual': 'Individual',
      'two-people': 'Two persons activity',
      'group':'Group activity',
    };

    return {
      id: data.id,
      name: data.additional_properties.find(param => param.key === 'name').value,
      description: data.additional_properties.find(param => param.key === 'description').value,
      type: typeMapping[data.activity],
      additionalParameters: data.additional_properties.filter(
        param => param.key !== 'name' && param.key !== 'description',
      ),
    };
  }
}
