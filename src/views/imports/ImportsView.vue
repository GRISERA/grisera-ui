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
            <v-card
              :elevation="4"
              class="d-flex flex-column"
              height="100%"
            >
              <v-card-title class="pb-0 mb-5">
                <v-icon left>
                  {{ getFileIcon(importJob.file_name) }}
                </v-icon>
                <span class="subtitle-1 font-weight-medium">{{ importJob.file_name }}</span>
              </v-card-title>
              <v-card-subtitle class="pt-0 text-caption">
                <span class="d-block">ID: <span class="import-id-ellipsis">{{ importJob.id }}</span></span>
                <span class="d-block">Created: {{ formatDate(importJob.created_at) }}</span>
              </v-card-subtitle>
              <v-card-text class="flex-grow-1">
                <div class="caption">
                  Description:
                </div>
                <div class="black--text text-body-2">
                  {{ importJob.description || '-' }}
                </div>
                <div class="caption mt-2">
                  Status:
                </div>
                <v-chip
                  :color="getStatusColor(importJob.status)"
                  class="font-weight-bold"
                  label
                  small
                  text-color="white"
                >
                  {{ importJob.status }}
                </v-chip>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-btn
                  :loading="isRefreshing[importJob.id]"
                  icon
                  small
                  @click="refreshSingleImportStatus(importJob)"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
                <v-spacer />
                <v-btn
                  :disabled="true"
                  color="red"
                  small
                  text
                  @click="deleteImport(importJob.id)"
                >
                  <v-icon
                    left
                    small
                  >
                    mdi-delete
                  </v-icon>
                  Cancel
                </v-btn>
              </v-card-actions>
            </v-card>
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
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import { mapState } from 'vuex';

export default {
  name: 'ImportsView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
    EmptyState,
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
      imports: [],
    }
  ),
  computed: {
    ...mapState({
      currentDatasetId: state => state.dataset?.id,
    }),
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
      console.log('Refreshing status for importJob:', JSON.parse(JSON.stringify(importJob)));
      console.log('Using currentDatasetId for API call:', this.currentDatasetId);

      if (!this.currentDatasetId) {
        this.showSnackbar('Error: No dataset selected. Cannot refresh status.', 'error');
        console.error('refreshSingleImportStatus: currentDatasetId is not available.');
        return;
      }

      this.$set(this.isRefreshing, importJob.id, true);
      try {
        const response = await ImportAPI.getStatus(importJob.id, this.currentDatasetId);
        this.$store.commit('updateImportStatus', {
          importId: importJob.id,
          status: response.data.status,
        });
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
    getFileIcon(fileName) {
      if (!fileName) {
        return 'mdi-file';
      }
      const ext = fileName.split('.').pop().toLowerCase();
      if (ext === 'owl') {
        return 'mdi-owl';
      }
      if (ext === 'json') {
        return 'mdi-code-json';
      }
      return 'mdi-file-document-outline';
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
    navigateToCreateImport() {
      if (this.currentDatasetId) {
        this.$router.push({ name: 'import-creation' });
      } else {
        this.showSnackbar('Please select a dataset first', 'warning');
      }
    },
  },
};
</script>

<style scoped>
.v-card-title {
  word-break: break-all;
}

.v-card-title {
  word-break: break-all;
}

.import-id-ellipsis {
  display: inline-block;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: bottom;
}
</style> 