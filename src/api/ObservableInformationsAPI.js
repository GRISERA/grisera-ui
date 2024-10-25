import BaseAPI2, { apiService } from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import RecordingsAPI from './RecordingsAPI';
import ModalitiesAPI from './ModalitiesAPI';
import LifeActivitiesAPI from './LifeActivitiesAPI';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.OBSERVABLE_INFORMATIONS;
  }

  static dTOFrontToAPI(data){
    return {
        id: data.id,
        modality_id: data.modality.id,
        life_activity_id: data.lifeActivity.id,
        recording_id: data.channel.recording_id,
    };
  }

  static dTOAPIToFront(data){
    if(Array.isArray(data))
        return data.map(e => this.dTOAPIToFront(e));

    const recording = data.recording ? RecordingsAPI.dTOAPIToFront(data.recording) : null;
    let channel = recording.registeredChannel.channel;
    channel.recording_id = recording.id;
    return {
        id: data.id,
        channel: channel,
        recording: recording,
        modality: data.modality ? ModalitiesAPI.dTOAPIToFront(data.modality) : null,
        lifeActivity: data.life_activity ? LifeActivitiesAPI.dTOAPIToFront(data.life_activity) : null,
    };
  }

  static update(data){
    return apiService.put(`/${this.getBasePath()}/${data.id}/relationships?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
  }
}