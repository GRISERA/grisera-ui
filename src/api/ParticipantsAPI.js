import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.PARTICIPANTS;
  }

  static dTOFrontToAPI(data){
    return {
      name: data.name + ' ' + data.surname,
      date_of_birth: data.birthDate,
      sex: data.sex,
      disorder: data.disorder, //not implemented in frontend
      additional_properties: data.additionalParameters.map(e => {return { key: e.name, value: e.value };}), //not implemented in frontend
    };
  }

  static dTOAPIToFront(data){
    if (!data)
      return;
    
    const nameDivided = data.name?.split(' ');
    return {
      id: data.id,
      name: nameDivided.slice(0, -1).join(' '),
      surname: nameDivided[nameDivided.length - 1],
      birthDate: data.date_of_birth,
      sex: data.sex,
      disorder: data.disorder, //not implemented in frontend
      additionalParameters: data.additional_properties?.map(e => {return { ...e, name: e.key };}),
    };
  }
}