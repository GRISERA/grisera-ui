import BaseAPI2, { apiService } from '@/api/BaseAPI2';
import DatabaseName from '@/const/relations/DatabaseName';

export default class extends BaseAPI2 {
  static getBasePath() {
    return DatabaseName.PERSONALITIES;
  }

  static getReturnValues(){
    return 'personalities';
  }

  static dTOFrontToAPI(data){
    return {
        openess: data.bigFiveValues ? data.bigFiveValues[0] : null,
        neuroticism: data.bigFiveValues ? data.bigFiveValues[1] : null,
        agreeableness: data.bigFiveValues ? data.bigFiveValues[2] : null,
        conscientiousness: data.bigFiveValues ? data.bigFiveValues[3] : null,
        extroversion: data.bigFiveValues ? data.bigFiveValues[4] : null,
        positive_affect: data.panasValues ? data.panasValues[0] : null,
        negative_affect: data.panasValues ? data.panasValues[1] : null,
    };
  }

  static dTOAPIToFront(data){
    if(!data)
        return;
    
    return {
        id: data.id,
        openess: data.openess,
        neuroticism: data.neuroticism,
        agreeableness: data.agreeableness,
        conscientiousness: data.conscientiousness,
        extroversion: data.extroversion,
        positiveAffect: data.positive_affect,
        negativeAffect: data.negative_affect,
        bigFiveValues: data.openess ? [data.openess, data.neuroticism, data.agreeableness, data.conscientiousness, data.extroversion] : null,
        panasValues: data.positive_affect ? [data.positive_affect, data.negative_affect] : null,
    };
  }

  
  static store(data) {
    if(data.bigFiveValues){
        return apiService.post(`/${this.getBasePath()}/big_five_model?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
    }
    else{
        return apiService.post(`/${this.getBasePath()}/panas_model?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
    }
    
  }

  static update(data) {
    if(data.bigFiveValues){
        return apiService.put(`/${this.getBasePath()}/big_five_model/${data.id}?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
    }
    else{
        return apiService.put(`/${this.getBasePath()}/panas_model/${data.id}?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
    }
  }
}