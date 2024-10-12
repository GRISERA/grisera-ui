import BaseAPI2, { apiService } from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import ActivitiesAPI from './ActivitiesAPI';
import ParticipantStatesAPI from './ParticipantStatesAPI';
import ParticipationsAPI from './ParticipationsAPI';
import ParticipantsAPI from './ParticipantsAPI';
import RecordingsAPI from './RecordingsAPI';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.ACTIVITY_EXECUTIONS;
  }

  static dTOFrontToAPI(data){
    return {
      activity_id: data.activity.id,
      arrangement_id: data.arrangement?.id || data.arrangement,
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
        ],
    };
  }

  static dTOAPIToFront(data){
    const recordings = RecordingsAPI.dTOAPIToFront(data.participations?.map(participation =>{
      participation.recordings?.forEach(element => {
        element.participant = participation.participant_state?.participant;
      });
      return participation.recordings;
    }).flat() || []);
    
    return {
      id: data.id,
      name: data.additional_properties?.find(param => param.key === 'name').value,
      description: data.additional_properties?.find(param => param.key === 'description').value,
      activity: ActivitiesAPI.dTOAPIToFront(data.activity),
      participations: data.participations,
      participants: data.participations?.map(e => ParticipantsAPI.dTOAPIToFront(e.participant_state?.participant)),
      participantStates: data.participations?.map(e => ParticipantStatesAPI.dTOAPIToFront(e.participant_state)),
      arrangement: data.arrangement,
      recordings: recordings,
      additionalParameters: data.additional_properties.filter(
        param => !['name', 'description'].includes(param.key),
      ).map(e => {return { ...e, name: e.key };}),
    };
  }

  static show(id, depth = 3) {
    return super.show(id, depth);
  }

  static update(data) {
    const dtoData = this.dTOFrontToAPI(data);
    return apiService.put(`/${this.getBasePath()}/${data.id}?${this.getDatasetName()}`, dtoData).then(async (response) => {
      if(dtoData.arrangement_id !== response.data.arrangement_id){
        await apiService.put(`/${this.getBasePath()}/${data.id}/relationships?${this.getDatasetName()}`, dtoData);
      }

      
      const oldParticipants = data.participations?.map(e => e.participant_state.participant_id).sort();
      const newParticipants = data.participants?.map(e => e.id).sort();
      var participantsAreEqual = true;
      if(oldParticipants.length !== newParticipants.length){
        participantsAreEqual = false;
      } else {
        for (let i = 0; i < oldParticipants.length; i++) {
          if (oldParticipants[i] !== newParticipants[i]) {
            participantsAreEqual = false;
            break;
          }
        }
      }

      if(!participantsAreEqual){
        const participantsToDelete = oldParticipants.filter(e => !newParticipants.includes(e));
        const participantsToAdd = newParticipants.filter(e => !oldParticipants.includes(e));
        
        const promiseAdd = Promise.all(participantsToAdd.map(participant => {
          return ParticipantStatesAPI.store({ participantId: participant }).then(newParticipantState => {
            return ParticipationsAPI.store({ activity_execution_id: data.id, participant_state_id: newParticipantState.data.id });
          });
        }));
        const promiseDelete = Promise.all(participantsToDelete.map(participant => {
          var fullParticipation = data.participations.find(participation => participation.participant_state.participant_id === participant);
          return ParticipationsAPI.delete(fullParticipation.id).then(() => {
            return ParticipantStatesAPI.delete(fullParticipation.participant_state.id);
          });
        }));

        await promiseAdd;
        await promiseDelete;
      }
      return;
    });
  }
}
