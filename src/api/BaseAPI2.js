import axios from 'axios';
import config from '../../config.js';
import Vue from 'vue';

export const apiService = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,  
  },
});

export default class BaseAPI2 {
  static getBasePath() {
    return '';
  }

  static getDatasetName() {
    return `dataset_id=${Vue.prototype.$store.state?.dataset?.id || null}`;
  }

  static getReturnValues(){
    return this.getBasePath();
  }

  static dTOFrontToAPI(data){
    return {};
  }

  static dTOAPIToFront(data){
    return {};
  }


  static index() {
    //console.log(`/${this.getBasePath()}?${this.getDatasetName()}`);
    return apiService.get(`/${this.getBasePath()}?${this.getDatasetName()}`).then(({ data }) => {
      
        data = data[this.getReturnValues()].map(e => this.dTOAPIToFront(e));
        //console.log('Index ', this.getBasePath(), ': ', data);
        return { data };
    });
  }

  static show(id, depth = 0) {
    //console.log(`/${this.getBasePath()}/${id}?${this.getDatasetName()}`);
    if(!id)
      return {};

    return apiService.get(`/${this.getBasePath()}/${id}?${this.getDatasetName()}&depth=${depth}`).then(({ data }) => {
        //console.log(data);
        data = this.dTOAPIToFront(data);
        //console.log('Show ', id, ' ', this.getBasePath(), ': ', data);
        return { data };
    });
  }

  static store(data) {
    //console.log('Store: ', data);
    //console.log('Store after dto: ', this.dTOFrontToAPI(data));
    return apiService.post(`/${this.getBasePath()}?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
  }

  static update(data) {
    console.log('Update: ', data);
    return apiService.put(`/${this.getBasePath()}/${data.id}?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
  }

  static delete(id) {
    return apiService.delete(`/${this.getBasePath()}/${id}?${this.getDatasetName()}`);
  }

  static count() {
    return apiService.get(`/${this.getBasePath()}?${this.getDatasetName()}`).then(({ data }) => {
        return data[this.getBasePath()].length;
      });
  }
}