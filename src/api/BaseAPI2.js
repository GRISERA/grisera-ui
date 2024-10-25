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
    return apiService.get(`/${this.getBasePath()}?${this.getDatasetName()}`).then(({ data }) => {
        data = data[this.getReturnValues()].map(e => this.dTOAPIToFront(e));
        return { data };
    });
  }

  static show(id, depth = 0) {
    if(!id)
      return {};

    return apiService.get(`/${this.getBasePath()}/${id}?${this.getDatasetName()}&depth=${depth}`).then(({ data }) => {
        data = this.dTOAPIToFront(data);
        return { data };
    });
  }

  static store(data) {
    return apiService.post(`/${this.getBasePath()}?${this.getDatasetName()}`, this.dTOFrontToAPI(data));
  }

  static update(data) {
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