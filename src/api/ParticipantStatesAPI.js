import BaseAPI2, { apiService } from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import ParticipantsAPI from './ParticipantsAPI';
import PersonatitiesAPI from './PersonatitiesAPI';
import ApperancesAPI from './ApperancesAPI';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.PARTICIPANT_STATES;
  }
  
  static getReturnValues(){
    return 'participant_states';
  }

  static dTOFrontToAPI(data){
    return {
      participant_id: data.participantId,
      personality_ids: data.personalityIds,
      appearance_ids: data.appearanceIds,
      age: data.age,
      additional_properties: [
        ...(data.additionalParameters?.map(e => {return { key: e.name, value: e.value };}) || []),
      ],
    };
  }

  static dTOAPIToFront(data){
    if(!data)
      return;
    
    return {
      id: data.id,
      participantId: data.participant_id,
      personalityIds: data.personality_ids,
      appearanceIds: data.appearance_ids,
      participant: ParticipantsAPI.dTOAPIToFront(data.participant),
      personalities: data.personalities?.map(personality => PersonatitiesAPI.dTOAPIToFront(personality)),
      appearances: data.appearances?.map(appearance => ApperancesAPI.dTOAPIToFront(appearance)),
      additionalParameters: data.additional_properties?.map(e => {return { ...e, name: e.key };}),
    };
  }

  static update(data) {
    return apiService.put(`/${this.getBasePath()}/${data.id}/relationships?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
  }
}