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
    permissions: undefined,
    data: undefined,
    imports: [],
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
    setPermissions(state, value) {
      state.permissions = value;
    },
    setData(state, value) {
      state.data = { ...value };
    },
    addImport(state, importData) {
      console.log('Store: Adding import:', importData);
      state.imports.push({
        id: importData.id,
        status: importData.status,
        file_name: importData.file_name,
        dataset_id: importData.dataset_id,
        created_at: importData.created_at || new Date().toISOString(),
        description: importData.description,
        // import_type: importData.import_type,
      });
      console.log('Store: Imports after adding:', state.imports);
    },
    removeImport(state, importId) {
      state.imports = state.imports.filter(imp => imp.id !== importId);
    },
    clearCompletedImports(state) {
      state.imports = state.imports.filter(imp =>
        imp.status !== 'completed' && imp.status !== 'failed',
      );
    },
    clearAllImports(state) {
      console.log('Store: Clearing all imports');
      state.imports = [];
    },
    setImports(state, imports) {
      console.log('Store: Setting imports:', imports);
      state.imports =
        imports.map(imp => (
          {
            ...imp,
            created_at: imp.created_at || new Date().toISOString(),
          }
        ));
    },
  },
  actions: {},
  getters: {
    getUser: state => state.user,
    getDataset: state => state.dataset,
    getPermission: state => state.permissions.filter(permission => permission.datasetId == state.dataset.id)[0],
    getActiveImports: state => {
      const activeImports = state.imports.filter(imp =>
        imp.status === 'pending' || imp.status === 'processing',
      );
      console.log('Store getActiveImports:', activeImports);
      return activeImports;
    },
    getAllImports: state => {
      console.log('Store getAllImports:', state.imports);
      return state.imports;
    },
    hasActiveImports: state => {
      const hasActive = state.imports.some(imp =>
        imp.status === 'pending' || imp.status === 'processing',
      );
      console.log('Store hasActiveImports:', hasActive, 'imports:', state.imports);
      return hasActive;
    },
  },
  plugins: [createPersistedState()], // Commented out - will be added back if needed
});

Vue.prototype.$store = store;

export default store;