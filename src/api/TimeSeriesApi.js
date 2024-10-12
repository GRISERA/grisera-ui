import BaseAPI2, { apiService } from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import ObservableInformationsAPI from './ObservableInformationsAPI';
import MeasuresAPI from './MeasuresAPI';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.TIME_SERIES;
  }

  static getReturnValues(){
    return 'time_series_nodes';
  }

  static dTOFrontToAPI(data){
    return {
      observable_information_ids: data.observableInformationIds,
      measure_id: data.measure.id,
      type: data.type,
      source: data.link,
      additional_properties: [
        ...(data.additionalParameters?.map(e => {return { key: e.name, value: e.value };}) || []),
        {
          key: 'spacing',
          value: data.spacing,
        },
      ],
    };
  }

  static dTOAPIToFront(data){
    return {
      id: data.id,
      observableInformationIds: data.observable_information_ids,
      measureId: data.measure_id,
      type: data.type,
      link: data.source,
      spacing: data.additional_properties?.find(param => param.key === 'spacing').value,
      additionalParameters: data.additional_properties.filter(
        param => !['spacing'].includes(param.key),
      ).map(e => {return { ...e, name: e.key };}),
      signalValues: data.signal_values,//not used yet
      observableInformations: data.observable_informations?.length > 0 ? ObservableInformationsAPI.dTOAPIToFront(data.observable_informations) : null,
      measure: data.measure ? MeasuresAPI.dTOAPIToFront(data.measure) : null,
    };
  }

  static index(activityExecutionId, participantId){
    return super.index().then(({ data }) => {
      return Promise.all(data.map(timeSeries => 
        this.show(timeSeries.id, 4),
      )).then(multipleTimeSeries => {
        multipleTimeSeries = multipleTimeSeries.map(e => e.data);
        multipleTimeSeries = multipleTimeSeries.filter(timeSeries => timeSeries.observableInformations[0].recording.participation.participant_state.participant_id === participantId && timeSeries.observableInformations[0].recording.participation.activity_execution_id === activityExecutionId);
        return { data: multipleTimeSeries };
      });
    });
  }
  
  static store(data) {
    return Promise.all(data.observableInformations
      .map(observableInformation =>
        ObservableInformationsAPI.store(observableInformation),
      )).then((observableInformations) => {
        data.observableInformationIds = observableInformations.map(item => item.data.id);
        return super.store(data);
      });
  }

  static update(data) {
    
    return this.show(data.id, 4).then(oldTimeSeries => {
      oldTimeSeries = oldTimeSeries.data;

      const oldObservableInformations = oldTimeSeries.observableInformations;
      const newObservableInformations = data.observableInformations;
      const observableInformationsToDelete = oldObservableInformations.filter(e => !newObservableInformations.some(newObservableInformation => newObservableInformation.id === e.id))
        .map(observableInformation => ObservableInformationsAPI.delete(observableInformation.id));
      const observableInformationsToAdd = newObservableInformations.filter(e => !e.id)
        .map(observableInformation => ObservableInformationsAPI.store(observableInformation));
      const observableInformationsToUpdate = newObservableInformations.filter(e => oldObservableInformations.some(oldObservableInformation => oldObservableInformation.id === e.id))
        .map(observableInformation => ObservableInformationsAPI.update(observableInformation));

      return Promise.all([...observableInformationsToDelete, ...observableInformationsToAdd, ...observableInformationsToUpdate]).then(async(results) => {
        data.observableInformationIds = results.slice(observableInformationsToDelete.length).map(e => e.data.id);

        const updatedValues = super.update(data);
        const updatedRelations = apiService.put(`/${this.getBasePath()}/${data.id}/relationships?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
        await updatedValues;
        await updatedRelations;
        return updatedRelations;
      });
    });
  }

  
}