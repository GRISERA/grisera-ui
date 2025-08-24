import BaseAPI2, { apiService } from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.REGISTERED_DATA;
  }


  static uploadFile(file) {
    if (!file) {
      return Promise.resolve();
    }

    const formData = new FormData();
    formData.append('file', file);

    return apiService.post(`/registered-data/upload-file?${ this.getDatasetName() }`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static getPreviewUrl(objectName) {
    return apiService.get(`/registered-data/preview/${ encodeURIComponent(objectName) }?${ this.getDatasetName() }`);
  }


  static dTOFrontToAPI(data) {
    return {
      id: data.id,
      source: data.link,
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


  static dTOAPIToFront(data) {
    if (data.link) {
      var dataOfRecording = [];
      if (data.participation) {
        dataOfRecording.push({
          channel: data.registered_channel.channel ? ChannelsAPI.dTOAPIToFront(data.registered_channel.channel) : null,
          participants: [ParticipantsAPI.dTOAPIToFront(data.participation.participant_state.participant)],
        });
      }
      return {
        id: data.id,
        link: data.source,
        objectName: data.object_name, // Add object_name for presigned URLs
        name: data.additional_properties?.find(param => param.key === 'name').value,
        description: data.additional_properties?.find(param => param.key === 'description').value,
        registeredChannels: data.registered_channels,

        additionalParameters: data.additional_properties?.filter(
          param => !['name', 'description'].includes(param.key),
        ).map(e => {return { ...e, name: e.key };}),
      };
    }

    return {
      id: data.id,
      link: data.source,
      objectName: data.object_name, // Add object_name for presigned URLs
      name: data.additional_properties?.find(param => param.key === 'name').value,
      description: data.additional_properties?.find(param => param.key === 'description').value,
      additionalParameters: data.additional_properties?.filter(
        param => !['name', 'description'].includes(param.key),
      ).map(e => {return { ...e, name: e.key };}),
    };
  }
}