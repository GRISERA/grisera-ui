import roles from '@/acl/roles';
import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    datasets: [],
    dataset: undefined,
    user: undefined,
    data: undefined,
    scopes: {},
  },
  mutations: {
    setDatasets(state, values) {
      state.datasets = [...values];
    },
    setDataset(state, value) {
      state.dataset = { ...value };
    },
    setUser(state, value) {
      state.user = { ...value };
    },
    setScopes(state, { permissions } = {}) {
      if (!Array.isArray(permissions)) {
        console.error('Permissions should be an array of { datasetId, role } objects');
      }

      permissions.forEach(({ datasetId, role }) => state.scopes[datasetId] = roles[role] || []);
    },
    setData(state, value) {
      state.data = { ...value };
    },
  },
  actions: {},
  getters: {
    getUser: state => state.user,
    getDataset: state => state.dataset,
    getPermission: state => state.user.permissions.filter(permission => permission.datasetId == state.dataset.id)[0],
  },
  plugins: [createPersistedState()],
});

Vue.prototype.$store = store;

export default store;