import LS from '@/storage/LS';
import DummyExperiments from '@/const/DummyExperiments';
import DummyParticipants from '@/const/DummyParticipants';
import DummyActivities from '@/const/DummyActivities';
import DummyChannels from '@/const/DummyChannels';
import DummyParameters from '@/const/DummyParameters';
import DummyModalities from '@/const/DummyModalities';
import DummyLifeActivities from '@/const/DummyLifeActivities';
import DummyScenarios from '@/const/DummyScenarios';
import Builder from '@/storage/Builder';
import DummyParametersTypes from '@/const/DummyParametersTypes';
import DummyMeasures from '@/const/DummyMeasures';
import Vue from 'vue';
import DummyDatasets from '@/const/DummyDatasets';

const STORAGE_NAME = 'pards';

export default class Storage {
  constructor() {
    this.data = LS.getJSON(STORAGE_NAME);
    this._variable_builder = undefined;
  }

  init() {
    if (LS.getJSON(STORAGE_NAME)) return;

    const datasets = DummyDatasets;

    const data = {
      [datasets[0].id]: {
        'activities': DummyActivities,
        'activityExecutions': [],
        'channels': DummyChannels,
        'datasets': DummyDatasets,
        'experiments': DummyExperiments,
        'lifeActivities': DummyLifeActivities,
        'measures': DummyMeasures,
        'modalities': DummyModalities,
        'parameterTypes': DummyParametersTypes,
        'parameters': DummyParameters,
        'participantStates': [],
        'participants': DummyParticipants,
        'recordings': [],
        'scenarioExecutions': [],
        'scenarios': DummyScenarios,
      },
    };

    LS.setJSON(STORAGE_NAME, data);
    Vue.prototype.$store.commit('setDatasets', datasets);
    Vue.prototype.$store.commit('setDataset', datasets[0]);
    Vue.prototype.$store.commit('setData', data);
  }

  clear() {
    LS.clear(STORAGE_NAME);
    LS.clear('vuex');
  }

  builder() {
    return this._variable_builder ? this._variable_builder : new Builder([]);
  }

  getByPath(path) {
    const currentDatasetId = Vue.prototype.$store.state?.dataset?.id || 1;
    return new Builder(this.data[currentDatasetId]?.[path] || [], this);
  }

  async storeByPath(path, values) {
    this.data[Vue.prototype.$store.state?.dataset?.id || 1][path] = values;
    LS.setJSON(STORAGE_NAME, this.data);
    Vue.prototype.$store.commit('setData', this.data);
  }
}
