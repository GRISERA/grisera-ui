import BaseAPI2 from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';
import MeasureNamesAPI from './MeasureNamesAPI';

import ModelType from '@/const/relations/ModelType';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.MEASURES;
  }

  static getModelType() {
    return ModelType.EXPERIMENT;
  }


  static dTOFrontToAPI(data){
    return {
      datatype: data.datatype,
      range: data.rangeStart ? data.rangeStart + '-' + data.rangeEnd : null,
      unit: data.unit || null,
      values: data.definedValue.map(e => e.definedValue ),
      measure_name_id: data.measure_name_id,
    };
  }

  static dTOAPIToFront(data){
    return {
      id: data.id,
      datatype: data.datatype,
      range: data.range,
      rangeStart: data.range?.split('-')[0],
      rangeEnd: data.range?.split('-')[1],
      unit: data.unit,
      definedValue: data.values.map(value => ({ definedValue: value })),
      measure_name_id: data.measure_name_id,
      type: data.datatype === 'string' ? 'Categorical' : 'Numeric',
      source: data.measure_name?.type,
      name: data.measure_name?.name,
    };
  }

  
  static index() {
    return super.index().then(({ data }) => { 
      //console.log('MeasureAPI data inside data variable:', data);
      return  Promise.all(data.map( measure => {
          //console.log('MeasureAPI data inside measure variable: ', measure);
          if (measure.measure_name_id !== null) {
            return MeasureNamesAPI.show(measure.measure_name_id).then(({ data }) => {
              //console.log('MeasureAPI data inside measure_name_response variable: ', data);
              const measure_final = {
                ...measure,
                name: data.name,
                source: data.source,
              };
              //console.log('MeasureAPI data inside returned full measure variable: ', measure_final);
              return measure_final;
            });
          } else {
            return measure;
          }
             
      })).then((finalMeasures) => {
        return { data: finalMeasures };
      });
    });
  }

  static show(id) {
    return super.show(id, 1);
  }

  static store(data) {
    const dataForMeasureNames = {
      name: data.name,
      source: data.source,
    };
    return MeasureNamesAPI.store(dataForMeasureNames).then(response => {
      data.measure_name_id = response.data.id;
      return super.store(data);
    });
  }

  static update(data) {
    const dataForMeasureNames = {
      id: data.measure_name_id,
      name: data.name,
      source: data.source,
    };
    return MeasureNamesAPI.update(dataForMeasureNames).then(() => {
      return super.update(data);
    });
 }
}