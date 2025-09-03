<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage || 'Manage your data exports'" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="text-right">
        <v-btn
          class="text-none font-weight-medium"
          color="primary"
          rounded
          @click.prevent.stop="$router.push({ name: 'export-creation' })"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          Create New Export
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <v-row v-if="!currentDatasetId">
          <v-col class="col-12 text-center">
            <p class="title grey--text">
              Please select a dataset first to see its exports.
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
            Loading exports...
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
          v-else-if="exports.length === 0"
          action-icon="mdi-plus"
          action-text="Create Your First Export"
          description="No exports found for this dataset. Start by creating your first data export to share your data."
          icon="mdi-database-export"
          title="No Exports Found"
          @action="navigateToCreateExport"
        />
        <v-row
          v-else
          class="fill-height"
        >
          <v-col
            v-for="exportJob in exports"
            :key="`export_${exportJob.id}`"
            class="col-md-4 col-sm-6 col-12 align-self-stretch"
          >
            <export-card
              :export-job="exportJob"
              :is-refreshing="isRefreshing[exportJob.id]"
              @delete="deleteExport"
              @download="downloadExport"
              @refresh="refreshSingleExportStatus"
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
import ExportAPI from '@/api/ExportAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import EmptyState from '@/components/EmptyState.vue';
import ExportCard from '@/components/ExportCard.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import { mapState } from 'vuex';

export default {
  name: 'ExportsView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
    EmptyState,
    ExportCard,
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
      exports: [],
    }
  ),
  computed: {
    ...mapState({
      currentDatasetId: state => state.dataset?.id,
    }),
    hasActiveExports() {
      return this.exports.some(exp => exp.status === 'pending' || exp.status === 'processing');
    },
  },
  watch: {
    currentDatasetId: {
      handler(newId) {
        if (newId) {
          this.loadExportsForDataset();
        } else {
          this.exports = [];
        }
      },
      immediate: true,
    },
    hasActiveExports: {
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
    async fetchExports() {
      const response = await ExportAPI.getExportsByDataset(this.currentDatasetId);
      this.exports = response.data;
    },
    async loadExportsForDataset() {
      if (!this.currentDatasetId) {
        return;
      }
      this.isLoading = true;
      await this.fetchExports();
      this.isLoading = false;
    },
    async refreshSingleExportStatus(exportJob) {
      console.log('Refreshing status for exportJob:', JSON.parse(JSON.stringify(exportJob)));
      console.log('Using currentDatasetId for API call:', this.currentDatasetId);

      if (!this.currentDatasetId) {
        this.showSnackbar('Error: No dataset selected. Cannot refresh status.', 'error');
        console.error('refreshSingleExportStatus: currentDatasetId is not available.');
        return;
      }

      this.$set(this.isRefreshing, exportJob.id, true);
      try {
        const response = await ExportAPI.getStatus(exportJob.id, this.currentDatasetId);
        const exportIndex = this.exports.findIndex(exp => exp.id === exportJob.id);
        if (exportIndex !== -1) {
          this.exports[exportIndex].status = response.data.status;
          this.exports[exportIndex].processed_records = response.data.processed_records || 0;
        }
        const format = exportJob.file_type || exportJob.export_format || 'json';
        this.showSnackbar(`Status for export ${ format.toUpperCase() } Export updated.`, 'info');
      } catch (error) {
        console.error('Error refreshing export status:', error);
        this.showSnackbar(`Error refreshing status: ${ error.response?.data?.detail || error.message }`, 'error');
      } finally {
        this.$set(this.isRefreshing, exportJob.id, false);
      }
    },
    async downloadExport(exportJob) {
      console.log('Downloading export:', exportJob.id);

      if (!this.currentDatasetId) {
        this.showSnackbar('Error: No dataset selected. Cannot download export.', 'error');
        return;
      }

      try {
        const response = await ExportAPI.downloadExport(exportJob.id, this.currentDatasetId);

        // Dla dummy implementacji - pokazujemy dane jako JSON
        if (response.data) {
          const exportFormat = exportJob.file_type || exportJob.export_format || 'json';
          const fileName = response.data.file_info?.file_name || `export_${ exportJob.id }`;
          const fileExtension = exportFormat === 'json' ? '.json' : exportFormat === 'csv' ? '.csv' : '.xml';

          const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${ fileName }${ fileExtension }`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          this.showSnackbar(`Export downloaded successfully: ${ fileName }${ fileExtension }`, 'success');
        }
      } catch (error) {
        console.error('Error downloading export:', error);
        this.showSnackbar(`Error downloading export: ${ error.response?.data?.detail || error.message }`, 'error');
      }
    },
    deleteExport(exportId) {
      console.warn('deleteExport not implemented yet for ExportsView', exportId);
      this.showSnackbar('Delete functionality to be implemented.', 'warning');
    },
    showSnackbar(text, color = 'info') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    navigateToCreateExport() {
      if (this.currentDatasetId) {
        this.$router.push({ name: 'export-creation' });
      } else {
        this.showSnackbar('Please select a dataset first', 'warning');
      }
    },
    startAutoRefresh() {
      console.log('Starting auto-refresh for active exports');
      this.autoRefreshInterval = setInterval(async () => {
        await this.refreshActiveExports();
      }, 1000);
    },
    stopAutoRefresh() {
      if (this.autoRefreshInterval) {
        console.log('Stopping auto-refresh');
        clearInterval(this.autoRefreshInterval);
        this.autoRefreshInterval = null;
      }
    },
    async refreshActiveExports() {
      if (!this.currentDatasetId) {
        return;
      }

      const activeExports = this.exports.filter(exp =>
        exp.status === 'pending' || exp.status === 'processing',
      );

      for (const exportJob of activeExports) {
        try {
          const response = await ExportAPI.getStatus(exportJob.id, this.currentDatasetId);
          const exportIndex = this.exports.findIndex(exp => exp.id === exportJob.id);
          if (exportIndex !== -1) {
            this.exports[exportIndex].status = response.data.status;
            this.exports[exportIndex].processed_records = response.data.processed_records || 0;
          }
        } catch (error) {
          console.error('Error refreshing export status:', error);
        }
      }
    },
  },
};
</script>
