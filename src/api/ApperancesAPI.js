import BaseAPI2, { apiService } from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.APPEARANCES;
  }

  static getReturnValues(){
    return 'appearances';
  }

  static dTOFrontToAPI(data){
    const typeMapping = {
        'heavy': 'Heavy',
        'some': 'Some',
        'no':'None',
    };

    return {
        beard: data.appearanceOclusionValues ? typeMapping[data.appearanceOclusionValues[0]] : null,
        moustache: data.appearanceOclusionValues ? typeMapping[data.appearanceOclusionValues[1]] : null,
        glasses: data.appearanceOclusionValues ? data.appearanceOclusionValues[2] : null,
        ectomorph: data.apperanceSomatotypeValues ? data.apperanceSomatotypeValues[0] : null,
        endomorph: data.apperanceSomatotypeValues ? data.apperanceSomatotypeValues[1] : null,
        mesomorph: data.apperanceSomatotypeValues ? data.apperanceSomatotypeValues[2] : null,
    };
  }

  static dTOAPIToFront(data){
    if(!data)
        return;

    const typeMapping = {
        'Heavy': 'heavy',
        'Some': 'some',
        'None':'no',
    };

    return {
        id: data.id,
        beard: typeMapping[data.beard],
        moustache: typeMapping[data.moustache],
        glasses: data.glasses,
        ectomorph: data.ectomorph,
        endomorph: data.endomorph,
        mesomorph: data.mesomorph,
        appearanceOclusionValues: data.beard ? [typeMapping[data.beard], typeMapping[data.moustache], data.glasses] : null,
        apperanceSomatotypeValues: data.ectomorph ? [data.ectomorph, data.endomorph, data.mesomorph] : null,
    };
  }

  static store(data) {
    if(data.appearanceOclusionValues){
        return apiService.post(`/${this.getBasePath()}/occlusion_model?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
    }
    else{
        return apiService.post(`/${this.getBasePath()}/somatotype_model?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
    }
    
  }

  static update(data) {
    if(data.appearanceOclusionValues){
        return apiService.put(`/${this.getBasePath()}/occlusion_model/${data.id}?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
    }
    else{
        return apiService.put(`/${this.getBasePath()}/somatotype_model/${data.id}?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
    }
  }
}