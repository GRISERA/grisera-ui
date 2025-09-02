<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage || 'Manage your data exports'" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="text-right">
        <v-btn
          :disabled="!currentDatasetId"
          :outlined="true"
          @click="$router.push({ name: 'export-creation' })"
        >
          {{ currentDatasetId ? 'Create Export' : 'Select Dataset First' }}
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <v-container class="container--fluid">
          <v-row v-if="!currentDatasetId">
            <v-col class="col-12 text-center">
              <p class="title grey--text">Please select a dataset first to see its exports.</p>
            </v-col>
          </v-row>
          <v-row v-else-if="isLoading" align-content="center" class="fill-height" justify="center">
            <v-col class="subtitle-1 text-center" cols="12">
              Loading exports...
            </v-col>
            <v-col cols="6">
              <v-progress-linear height="6" indeterminate rounded></v-progress-linear>
            </v-col>
          </v-row>
          <v-row v-else-if="exports.length === 0">
            <v-col class="col-12 text-center">
              <p class="title grey--text">No exports found for this dataset.</p>
            </v-col>
          </v-row>
          <v-row v-else class="fill-height">
            <v-col
              v-for="exportJob in exports"
              :key="`export_${exportJob.id}`"
              class="col-md-4 col-sm-6 col-12 align-self-stretch"
            >
              <v-card :elevation="4" class="d-flex flex-column" height="100%">
                <v-card-title class="pb-0 mb-5">
                  <v-icon left>{{ getExportIcon(getExportFormat(exportJob)) }}</v-icon>
                  <span class="subtitle-1 font-weight-medium">{{ getExportDisplayName(exportJob) }}</span>
                </v-card-title>
                <v-card-subtitle class="pt-0 text-caption">
                  <span class="d-block">ID: <span class="export-id-ellipsis">{{ exportJob.id }}</span></span>
                  <span class="d-block">Created: {{ formatDate(exportJob.created_at) }}</span>
                  <span class="d-block">Format: {{ getExportFormat(exportJob) }}</span>
                </v-card-subtitle>
                <v-card-text class="flex-grow-1">
                  <div class="caption">Description:</div>
                  <div class="black--text text-body-2">{{ exportJob.description || '-' }}</div>
                  <div class="caption mt-2">Status:</div>
                  <v-chip :color="getStatusColor(exportJob.status)" class="font-weight-bold" label small
                          text-color="white">
                    {{ exportJob.status }}
                  </v-chip>
                  <div v-if="exportJob.processed_records > 0" class="caption mt-2">
                    Records: {{ exportJob.processed_records }}
                  </div>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-btn :loading="isRefreshing[exportJob.id]" icon small
                         @click="refreshSingleExportStatus(exportJob)">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                  <v-btn v-if="exportJob.status === 'completed'"
                         color="primary" icon
                         small
                         @click="downloadExport(exportJob)">
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                  <v-spacer />
                  <v-btn :disabled="true" color="red" small text
                         @click="deleteExport(exportJob.id)">
                    <v-icon left small>mdi-delete</v-icon>
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import ExportAPI from '@/api/ExportAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'ExportsView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
  },
  data: () => (
    {
      isLoading: false,
      isRefreshing: {},
      snackbar: {
        show: false,
        text: '',
        color: 'info',
        timeout: 4000,
      },
    }
  ),
  computed: {
    ...mapState({
      currentDatasetId: state => state.dataset?.id,
    }),
    ...mapGetters({
      exports: 'getAllExports',
    }),
  },
  watch: {
    currentDatasetId: {
      handler(newId) {
        if (newId) {
          this.loadExportsForDataset();
        } else {
          this.$store.commit('setExports', []);
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions([
      'fetchExports',
    ]),
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
        this.$store.commit('updateExportStatus', {
          exportId: exportJob.id,
          status: response.data.status,
          exported_records: response.data.processed_records || 0,
        });
        this.showSnackbar(`Status for export ${ this.getExportDisplayName(exportJob) } updated.`, 'info');
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
          const exportFormat = this.getExportFormat(exportJob);
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
    getStatusColor(status) {
      switch (status) {
        case 'pending':
          return 'orange';
        case 'processing':
          return 'blue';
        case 'completed':
          return 'green';
        case 'failed':
          return 'red';
        default:
          return 'grey';
      }
    },
    getExportIcon(format) {
      switch (format) {
        case 'json':
          return 'mdi-code-json';
        case 'csv':
          return 'mdi-file-delimited-outline';
        case 'xml':
          return 'mdi-xml';
        default:
          return 'mdi-export';
      }
    },
    getExportDisplayName(exportJob) {
      const format = this.getExportFormat(exportJob);
      return `${ format.toUpperCase() } Export`;
    },
    getExportFormat(exportJob) {
      // FileOperationOut używa file_type zamiast export_format
      return exportJob.file_type || exportJob.export_format || 'json';
    },
    formatDate(dateString) {
      if (!dateString) {
        return '-';
      }
      try {
        return new Date(dateString).toLocaleString();
      } catch (e) {
        return dateString;
      }
    },
    isPermanentStatus(status) {
      return ['completed', 'failed'].includes(status);
    },
  },
};
</script>

<style scoped>
.v-card-title {
  word-break: break-all;
}

.export-id-ellipsis {
  display: inline-block;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
</style>

