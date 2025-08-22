import DatabaseName from '@/const/relations/DatabaseName';
import BaseAPI2 from './BaseAPI2';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.PARTICIPANTS;
  }

  static dTOFrontToAPI(data) {
    return {
      name: data.name,
      surname: data.surname,
      date_of_birth: data.birthDate,
      sex: data.sex,
      disorder: data.disorder, // not implemented in frontend
      additional_properties: data.additionalParameters?.map(e => (
        {
          key: e.name,
          value: e.value,
        }
      )) || [],
    };
  }

  static dTOAPIToFront(data) {
    if (!data) {
      return;
    }

    return {
      id: data.id,
      name: data.name,
      surname: data.surname,
      birthDate: data.date_of_birth,
      sex: data.sex,
      disorder: data.disorder, // not implemented in frontend
      additionalParameters: data.additional_properties?.map(e => (
        {
          ...e,
          name: e.key,
        }
      )) || [],
    };
  }
}
