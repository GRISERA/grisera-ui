<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage || 'Manage your data imports'" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="text-right">
        <v-btn
          class="text-none font-weight-medium"
          color="primary"
          rounded
          @click.prevent.stop="$router.push({ name: 'import-creation' })"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          Create New Import
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <v-row v-if="!currentDatasetId">
          <v-col class="col-12 text-center">
            <p class="title grey--text">
              Please select a dataset first to see its imports.
            </p>
          </v-col>
        </v-row>
        <v-row
          v-else-if="isLoading"
          align-content="center"
          class="fill-height"
          justify="center"
        >
          <v-col
            class="subtitle-1 text-center"
            cols="12"
          >
            Loading imports...
          </v-col>
          <v-col cols="6">
            <v-progress-linear
              height="6"
              indeterminate
              rounded
            />
          </v-col>
        </v-row>
        <!-- Empty State -->
        <empty-state
          v-else-if="imports.length === 0"
          action-icon="mdi-plus"
          action-text="Create Your First Import"
          description="No imports found for this dataset. Start by creating your first data import to begin working with your data."
          icon="mdi-database-import"
          title="No Imports Found"
          @action="navigateToCreateImport"
        />
        <v-row
          v-else
          class="fill-height"
        >
          <v-col
            v-for="importJob in imports"
            :key="`import_${importJob.id}`"
            class="col-md-4 col-sm-6 col-12 align-self-stretch"
          >
            <import-card
              :import-job="importJob"
              :is-refreshing="isRefreshing[importJob.id] || false"
              @delete="deleteImport"
              @refresh="refreshSingleImportStatus"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import ImportAPI from '@/api/ImportAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import EmptyState from '@/components/EmptyState.vue';
import ImportCard from '@/components/ImportCard.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import { mapState } from 'vuex';

export default {
  name: 'ImportsView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
    EmptyState,
    ImportCard,
  },
  data: () => (
    {
      isLoading: false,
      isRefreshing: {},
      autoRefreshInterval: null,
      snackbar: {
        show: false,
        text: '',
        color: 'info',
        timeout: 4000,
      },
      imports: [],
    }
  ),
  computed: {
    ...mapState({
      currentDatasetId: state => state.dataset?.id,
    }),
    hasActiveImports() {
      return this.imports.some(imp => imp.status === 'pending' || imp.status === 'processing');
    },
  },
  watch: {
    currentDatasetId: {
      handler(newId) {
        if (newId) {
          this.loadImportsForDataset();
        } else {
          this.$store.commit('setImports', []);
        }
      },
      immediate: true,
    },
    hasActiveImports: {
      handler(hasActive) {
        if (hasActive && !this.autoRefreshInterval) {
          this.startAutoRefresh();
        } else if (!hasActive && this.autoRefreshInterval) {
          this.stopAutoRefresh();
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    this.stopAutoRefresh();
  },
  methods: {
    async fetchImports() {
      const { data } = await ImportAPI.getImportsByDataset(this.currentDatasetId);
      this.imports = data;
    },
    async loadImportsForDataset() {
      if (!this.currentDatasetId) {
        return;
      }
      this.isLoading = true;
      await this.fetchImports();
      this.isLoading = false;
    },
    async refreshSingleImportStatus(importJob) {
      if (!this.currentDatasetId) {
        this.showSnackbar('Error: No dataset selected. Cannot refresh status.', 'error');
        console.error('refreshSingleImportStatus: currentDatasetId is not available.');
        return;
      }

      this.$set(this.isRefreshing, importJob.id, true);
      try {
        const { data } = await ImportAPI.getStatus(importJob.id, this.currentDatasetId);

        const importIndex = this.imports.findIndex(imp => imp.id === importJob.id);

        if (importIndex !== -1) {
          this.imports[importIndex].status = data.status;
          this.imports[importIndex].additional_data = data.additional_data;
          this.imports[importIndex].processed_records = data.processed_records || 0;
        }

        this.showSnackbar(`Status for ${ importJob.file_name } updated.`, 'info');
      } catch (error) {
        console.error('Error refreshing import status:', error);
        this.showSnackbar(`Error refreshing status: ${ error.response?.data?.detail || error.message }`, 'error');
      } finally {
        this.$set(this.isRefreshing, importJob.id, false);
      }
    },
    deleteImport(importId) {
      console.warn('deleteImport not implemented yet for ImportsView', importId);
      this.showSnackbar('Delete functionality to be implemented.', 'warning');
    },
    showSnackbar(text, color = 'info') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    navigateToCreateImport() {
      if (this.currentDatasetId) {
        this.$router.push({ name: 'import-creation' });
      } else {
        this.showSnackbar('Please select a dataset first', 'warning');
      }
    },
    startAutoRefresh() {
      console.log('Starting auto-refresh for active imports');
      this.autoRefreshInterval = setInterval(async () => {
        await this.refreshActiveImports();
      }, 1000);
    },
    stopAutoRefresh() {
      if (this.autoRefreshInterval) {
        console.log('Stopping auto-refresh');
        clearInterval(this.autoRefreshInterval);
        this.autoRefreshInterval = null;
      }
    },
    async refreshActiveImports() {
      if (!this.currentDatasetId) {
        return;
      }

      const activeImports = this.imports.filter(imp =>
        imp.status === 'pending' || imp.status === 'processing',
      );

      for (const importJob of activeImports) {
        try {
          const { data } = await ImportAPI.getStatus(importJob.id, this.currentDatasetId);
          const importIndex = this.imports.findIndex(imp => imp.id === importJob.id);

          if (importIndex !== -1) {
            this.imports[importIndex].status = data.status;
            this.imports[importIndex].additional_data = data.additional_data;
            this.imports[importIndex].processed_records = data.processed_records || 0;
          }
        } catch (error) {
          console.error('Error refreshing import status:', error);
        }
      }
    },
  },
};
</script>

<style scoped>
.import-id-ellipsis {
  display: inline-block;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
</style> 