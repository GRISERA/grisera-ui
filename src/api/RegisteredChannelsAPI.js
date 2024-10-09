import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import ChannelsAPI from './ChannelsAPI';
import RegisteredDataAPI from './RegisteredDataAPI';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.REGISTERED_CHANNELS;
  }

  static dTOFrontToAPI(data){
    return {
        id: data.id,
        channel_id: data.channelId,
        registered_data_id: data.registeredDataId,
    };
  }

  static dTOAPIToFront(data){
    return {
        id: data.id,
        registeredData: data.registered_data ? RegisteredDataAPI.dTOAPIToFront(data.registered_data) : null,
        channel: data.channel ? ChannelsAPI.dTOAPIToFront(data.channel) : null,
    };
  }
}