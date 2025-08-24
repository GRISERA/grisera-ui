<template>
  <v-container class="container--fluid mt-4">
    <page-header
      :description="$route.meta.infoMessage"
      action-icon="mdi-plus"
      action-text="Create Dataset"
      data-testid="datasets-page-header"
      title="Datasets"
      @action="createDataset"
    />
    <v-row>
      <v-col class="col-12">
        <v-container class="container--fluid">
          <!-- Empty State -->
          <empty-state
            v-if="datasets.length === 0"
            action-icon="mdi-plus"
            action-text="Create Your First Dataset"
            data-testid="datasets-empty-state"
            description="You haven't created any datasets yet. Start by creating your first dataset to organize your research data."
            icon="mdi-database-outline"
            title="No Datasets Found"
            @action="createDataset"
          />

          <!-- Datasets Grid -->
          <v-row
            v-else
            class="fill-height"
            data-testid="datasets-grid"
          >
            <v-col
              v-for="dataset in datasets"
              :key="`dataset_${dataset.id}`"
              class="dataset-col"
              cols="12"
              lg="4"
              md="6"
            >
              <dataset-list-card
                :can-edit="canEditDataset(dataset.id)"
                :data-testid="`dataset-card-${dataset.id}`"
                :dataset="dataset"
                @delete="confirmDeleteDataset"
                @edit="editDataset"
                @select="selectCurrentDataset"
                @show-description="openDescriptionDialog"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
    </v-snackbar>

    <dataset-create-dialog
      v-model="showCreateDialog"
      :edit-dataset="datasetToEdit"
      data-testid="dataset-create-dialog"
      @input="onDialogClose"
      @dataset-created="onDatasetCreated"
      @dataset-updated="onDatasetUpdated"
      @dataset-error="onDatasetError"
    />

    <delete-confirm-dialog
      :active.sync="showDeleteDialog"
      data-testid="dataset-delete-dialog"
      title="Delete Dataset"
      @cancel="cancelDelete"
      @submit="deleteDataset"
    >
      <div class="py-4">
        <p class="mb-2">
          Are you sure you want to delete this dataset?
        </p>
        <div
          v-if="datasetToDelete"
          class="error--text font-weight-bold text-h6"
        >
          {{ datasetToDelete.name }}
        </div>
        <p class="mt-3 caption grey--text">
          This action cannot be undone. All data associated with this dataset will be permanently deleted.
        </p>
      </div>
    </delete-confirm-dialog>

    <description-dialog
      :dataset="descriptionDialogDataset"
      :show.sync="showDescriptionDialog"
      data-testid="dataset-description-dialog"
    />
  </v-container>
</template>

<script>
import DatasetAPI from '@/api/DatasetAPI';
import DatasetCreateDialog from '@/components/DatasetCreateDialog.vue';
import DatasetListCard from '@/components/DatasetListCard.vue';
import DeleteConfirmDialog from '@/components/dialog/DeleteConfirmDialog.vue';
import DescriptionDialog from '@/components/dialog/DescriptionDialog.vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import AccessRoles from '@/const/AccessRoles';
import PermissionsService from '@/services/PermissionsService';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'DatasetsView',
  components: {
    DatasetCreateDialog,
    DatasetListCard,
    EmptyState,
    PageHeader,
    DeleteConfirmDialog,
    DescriptionDialog,
  },
  data: () => {
    return {
      permissions: [],
      datasets: [],
      selectedDatasetForImport: null,
      isUploading: false,
      showCreateDialog: false,
      datasetToEdit: null,
      showDeleteDialog: false,
      datasetToDelete: null,
      showDescriptionDialog: false,
      descriptionDialogDataset: null,
      snackbar: {
        show: false,
        text: '',
        color: 'info',
        timeout: 4000,
      },
    };
  },
  created() {
    DatasetAPI.index().then(({ data }) => {
      this.datasets = data;
    });
    PermissionsService.getUserPermissions(this.getUser().userId).then((response) => {
      this.permissions = response.data;
    });
  },
  methods: {
    ...mapMutations({
      setDataset: 'setDataset',
    }),
    ...mapGetters({
      getUser: 'getUser',
    }),
    selectCurrentDataset(dataset) {
      this.setDataset(dataset);
      this.$router.push({ name: 'main' });
    },
    canEditDataset(datasetId) {
      const permission = this.permissions.find(permission => permission.datasetId == datasetId);
      return permission && permission.role != AccessRoles.READER;
    },
    createDataset() {
      this.datasetToEdit = null;
      this.showCreateDialog = true;
    },
    editDataset(dataset) {
      this.datasetToEdit = dataset;
      this.showCreateDialog = true;
    },
    async onDatasetCreated() {
      try {
        // Refresh both datasets and permissions
        const [datasetsResponse, permissionsResponse] = await Promise.all([
          DatasetAPI.index(),
          PermissionsService.getUserPermissions(this.getUser().userId),
        ]);

        this.datasets = datasetsResponse.data;
        this.permissions = permissionsResponse.data;
      } catch (error) {
        console.error('Error refreshing data:', error);
      }

      this.datasetToEdit = null;
    },
    async onDatasetUpdated() {
      try {
        // Refresh both datasets and permissions
        const [datasetsResponse, permissionsResponse] = await Promise.all([
          DatasetAPI.index(),
          PermissionsService.getUserPermissions(this.getUser().userId),
        ]);

        this.datasets = datasetsResponse.data;
        this.permissions = permissionsResponse.data;
      } catch (error) {
        console.error('Error refreshing data:', error);
      }

      this.datasetToEdit = null;
    },
    onDatasetError(errorMessage) {
      this.showSnackbar(errorMessage, 'error');
    },
    onDialogClose(isOpen) {
      if (!isOpen) {
        this.datasetToEdit = null;
      }
    },
    showSnackbar(text, color = 'info') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    confirmDeleteDataset(dataset) {
      this.datasetToDelete = dataset;
      this.showDeleteDialog = true;
    },
    async deleteDataset() {
      if (!this.datasetToDelete) {
        return;
      }

      try {
        await DatasetAPI.delete(this.datasetToDelete.id);

        const [datasetsResponse, permissionsResponse] = await Promise.all([
          DatasetAPI.index(),
          PermissionsService.getUserPermissions(this.getUser().userId),
        ]);

        this.datasets = datasetsResponse.data;
        this.permissions = permissionsResponse.data;
      } catch (error) {
        console.error('Error deleting dataset:', error);
        this.showSnackbar(
          error.response?.data?.message || 'An error occurred while deleting the dataset',
          'error',
        );
      } finally {
        this.showDeleteDialog = false;
        this.datasetToDelete = null;
      }
    },
    cancelDelete() {
      this.showDeleteDialog = false;
      this.datasetToDelete = null;
    },
    openDescriptionDialog(dataset) {
      this.descriptionDialogDataset = dataset;
      this.showDescriptionDialog = true;
    },
  },
};
</script>