import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import RegisteredDataAPI from './RegisteredDataAPI';
import RegisteredChannelsAPI from './RegisteredChannelsAPI';
import ActivityExecutionsAPI from './ActivityExecutionsAPI';
import ChannelsAPI from './ChannelsAPI';
import ParticipantsAPI from './ParticipantsAPI';

function mapRecordings(recordings){
  //console.log(recordings);
  if(!recordings){
    return recordings;
  }

  const srot =  Object.values(recordings.reduce((acc, recording) => {
    if (!acc[recording.registeredDataId]) {
      acc[recording.registeredDataId] = {
        id: [],
        link: recording.link,
        name: recording.name,
        description: recording.description,
        chosenAE: recording.chosenAE,
        registeredDataId: recording.registeredDataId,
        registeredData: recording.registeredChannel.registeredData,
        data: [],
      };
    }
    acc[recording.registeredDataId].id.push(recording.id);
    
    var dataOfRecording = acc[recording.registeredDataId].data.find(obj => obj.registeredChannel.id === recording.registeredChannel.id);
    if(dataOfRecording){
      dataOfRecording.participants.push({ ...recording.participant, recording_id: recording.id });
      dataOfRecording.participations.push(recording.participation);
    } else {
      acc[recording.registeredDataId].data.push({
        channel: recording.registeredChannel.channel,
        registeredChannel: recording.registeredChannel,
        participants: [{
          ...recording.participant,
          recording_id: recording.id,
        }],
        participations: [
          recording.participation,
        ],
      });
    }
    return acc;
  }, {}));

  return srot;
}

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.RECORDINGS;
  }

  static dTOFrontToAPI(data){
    return {
      id: data.id,
      participation_id: data.participation.id || data.participationId,
      registered_channel_id: data.registeredChannel.id || data.registeredChannelId,
      additional_properties: [
        ...(data.additionalParameters?.map(e => {return { key: e.name, value: e.value };}) || []),
      ],
    };
  }

  static dTOAPIToFront(data){
    if(!data)
      return;
    
    if(Array.isArray(data)){
      if(!data[0]){
        return [];
      }
      return mapRecordings(data.map(recording => this.dTOAPIToFront(recording)));
    }
    
    var registeredChannel = data.registered_channel ? RegisteredChannelsAPI.dTOAPIToFront(data.registered_channel) : null;
    var dataOfRecording = [];
    if(data.links){
      //console.log(data);
      dataOfRecording.push({
        channel: data.registered_channel.channel ? ChannelsAPI.dTOAPIToFront(data.registered_channel.channel) : null,
        participants: [ParticipantsAPI.dTOAPIToFront(data.participation.participant_state.participant)],
      });
    }
    var chosenAE = data.participation?.activity_execution ? { ...ActivityExecutionsAPI.dTOAPIToFront(data.participation?.activity_execution), participants: [ParticipantsAPI.dTOAPIToFront(data.participation.participant_state.participant)] } : null;
    return {
      id: data.id,
      name: registeredChannel?.registeredData?.name,
      description: registeredChannel?.registeredData?.description,
      link: registeredChannel?.registeredData?.link,
      registeredDataId: registeredChannel?.registeredData?.id,
      registeredChannelId: registeredChannel?.id,
      registeredChannel: registeredChannel,
      participation: data.participation,
      participant: data.participation ? ParticipantsAPI.dTOAPIToFront(data.participation.participant_state.participant) : data.participant,
      chosenAE: chosenAE,
      data: dataOfRecording,
      participationId: data.participation_id,
    };
  }

  static store(data) {
    return RegisteredDataAPI.store(data).then((responseRD) => {
      return Promise.all(data.data.map(channelInfo => {
        return RegisteredChannelsAPI.store({ channelId: channelInfo.channel.id, registeredDataId: responseRD.data.id }).then(responseRC => {
          return Promise.all(channelInfo.participants.map(participant => {
            super.store(
              {
                participation: data.chosenAE.participations.find(participation => participation.participant_state.participant.id === participant.id),
                registeredChannel: responseRC.data, 
              },
            );
        }));
        });
      }));
    });
  }

  static update(data){
    //console.log('update: ', data);
    return this.delete(data.id).then(() => {
      return this.store(data);
    });
  }

  static delete(id){
    if(Array.isArray(id)){
      return Promise.all(id.map(e => this.delete(e)));
    }
    return super.delete(id);
  }

  static index(){
    return super.index()
      .then(({ data }) => {
        //console.log(data);
        return Promise.all(data.map(recording => {
          //console.log(recording.id);
          return this.show(recording.id, 3);
        })).then((data) => {
          return { data: mapRecordings(data.map(e => e.data)) };
        });
      });
  }
}
