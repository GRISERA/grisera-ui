import roles from '@/acl/roles';
import Vue from 'vue';
import Vuex from 'vuex';
import ImportAPI from '@/api/ImportAPI';
// import ExportAPI from '@/api/ExportAPI';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    datasets: [],
    dataset: undefined,
    user: undefined,
    data: undefined,
    imports: [],
    exports: [],
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
    updateImportStatus(state, { importId, status }) {
      const importIndex = state.imports.findIndex(imp => imp.id === importId);
      if (importIndex !== -1) {
        state.imports[importIndex].status = status;
      }
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
    // Export mutations
    addExport(state, exportData) {
      console.log('Store: Adding export:', exportData);
      state.exports.push({
        id: exportData.id,
        status: exportData.status,
        export_format: exportData.export_format,
        dataset_id: exportData.dataset_id,
        created_at: exportData.created_at || new Date().toISOString(),
        description: exportData.description,
        exported_records: exportData.exported_records || 0,
        export_filters: exportData.export_filters,
      });
      console.log('Store: Exports after adding:', state.exports);
    },
    updateExportStatus(state, { exportId, status, exported_records }) {
      const exportIndex = state.exports.findIndex(exp => exp.id === exportId);
      if (exportIndex !== -1) {
        state.exports[exportIndex].status = status;
        if (exported_records !== undefined) {
          state.exports[exportIndex].exported_records = exported_records;
        }
      }
    },
    removeExport(state, exportId) {
      state.exports = state.exports.filter(exp => exp.id !== exportId);
    },
    clearCompletedExports(state) {
      state.exports = state.exports.filter(exp =>
        exp.status !== 'completed' && exp.status !== 'failed',
      );
    },
    clearAllExports(state) {
      console.log('Store: Clearing all exports');
      state.exports = [];
    },
    setExports(state, exports) {
      console.log('Store: Setting exports:', exports);
      state.exports = exports.map(exp => ({
        ...exp,
        created_at: exp.created_at || new Date().toISOString(),
      }));
    },
  },
  actions: {
    async fetchExports({ commit, rootState }) {
      if (!rootState.dataset || !rootState.dataset.id) {
        console.warn('Store fetchExports: No dataset selected, cannot fetch exports.');
        return;
      }
      const datasetId = rootState.dataset.id;
      console.log(`Store fetchExports: Fetching exports for dataset ID: ${datasetId}`);
      try {
        const response = await ExportAPI.getExportsByDataset(datasetId);
        console.log('Store fetchExports: Received exports from API:', response.data);
        commit('setExports', response.data);
      } catch (error) {
        console.error(`Store fetchExports: Error fetching exports for dataset ${datasetId}:`, error);
        commit('setExports', []);
      }
    },
  },
  getters: {
    getUser: state => state.user,
    getDataset: state => state.dataset,
    getPermission: state => {
      if (!state.user || !state.user.permissions || !state.dataset) {
        return null;
      }
      return state.user.permissions.filter(permission => permission.datasetId == state.dataset.id)[0];
    },
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
    // Export getters
    getActiveExports: state => {
      const activeExports = state.exports.filter(exp =>
        exp.status === 'pending' || exp.status === 'processing',
      );
      console.log('Store getActiveExports:', activeExports);
      return activeExports;
    },
    getAllExports: state => {
      console.log('Store getAllExports:', state.exports);
      return state.exports;
    },
    hasActiveExports: state => {
      const hasActive = state.exports.some(exp =>
        exp.status === 'pending' || exp.status === 'processing',
      );
      console.log('Store hasActiveExports:', hasActive, 'exports:', state.exports);
      return hasActive;
    },
  },
  plugins: [createPersistedState()], // Commented out - will be added back if needed
});

Vue.prototype.$store = store;

export default store;