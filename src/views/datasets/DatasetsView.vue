<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="text-right">
        <v-btn
          color="primary"
          @click="createDataset"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          Create Dataset
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <v-container class="container--fluid">
          <v-row class="fill-height">
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

    <input
      ref="fileInput"
      accept=".owl,.json"
      style="display: none"
      type="file"
      @change="handleFileSelect"
    >

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
      @input="onDialogClose"
      @dataset-created="onDatasetCreated"
      @dataset-updated="onDatasetUpdated"
      @dataset-error="onDatasetError"
    />

    <delete-confirm-dialog
      :active.sync="showDeleteDialog"
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
    />
  </v-container>
</template>

<script>
import DatasetAPI from '@/api/DatasetAPI';
import ImportAPI from '@/api/ImportAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import DatasetCreateDialog from '@/components/DatasetCreateDialog.vue';
import DatasetListCard from '@/components/DatasetListCard.vue';
import DeleteConfirmDialog from '@/components/dialog/DeleteConfirmDialog.vue';
import DescriptionDialog from '@/components/dialog/DescriptionDialog.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import AccessRoles from '@/const/AccessRoles';
import PermissionsService from '@/services/PermissionsService';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'DatasetsView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
    DatasetCreateDialog,
    DatasetListCard,
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
    openFileDialog(dataset) {
      this.selectedDatasetForImport = dataset;
      this.$nextTick(() => {
        try {
          const fileInput = this.$refs.fileInput;
          if (fileInput && typeof fileInput.click === 'function') {
            fileInput.click();
          } else {
            console.error('File input not available or click method not found');
            this.showSnackbar('Nie można otworzyć dialogu wyboru pliku', 'error');
          }
        } catch (error) {
          console.error('Error opening file dialog:', error);
          this.showSnackbar('Błąd podczas otwierania dialogu wyboru pliku', 'error');
        }
      });
    },
    async handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      // Validate file extension
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!['owl', 'json'].includes(fileExtension)) {
        this.showSnackbar('Dozwolone są tylko pliki .owl i .json', 'error');
        return;
      }

      this.isUploading = true;

      console.log('Selected dataset for import:', this.selectedDatasetForImport);
      console.log('Dataset ID:', this.selectedDatasetForImport?.id);
      console.log('File extension:', fileExtension);

      try {
        const response = await ImportAPI.uploadFile(
          file,
          this.selectedDatasetForImport.id,
          fileExtension,
          `Import from file: ${ file.name } for dataset: ${ this.selectedDatasetForImport.name }`,
        );

        // Dodaj import do store'a dla monitorowania
        console.log('Full response:', response);
        console.log('Response data:', response.data);

        this.$store.commit('addImport', {
          id: response.data.id,
          status: response.data.status,
          fileName: file.name,
          datasetId: this.selectedDatasetForImport.id,
        });

        console.log('Import added to store');
        console.log('Store imports after adding:', this.$store.state.imports);
        console.log('Has active imports:', this.$store.getters.hasActiveImports);

        this.showSnackbar(
          `Plik ${ file.name } został zaimportowany pomyślnie do datasetu: ${ this.selectedDatasetForImport.name }`,
          'success',
        );
        console.log('Import result:', response.data);

        // Reset file input
        this.$refs.fileInput.value = '';
        this.selectedDatasetForImport = null;

      } catch (error) {
        console.error('Import error:', error);
        this.showSnackbar(`Błąd podczas importu: ${ error.response?.data?.detail || error.message }`, 'error');

        // Reset file input
        this.$refs.fileInput.value = '';
        this.selectedDatasetForImport = null;
      } finally {
        this.isUploading = false;
      }
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

        // Refresh both datasets and permissions after deletion
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

<style scoped>
.dataset-col {
  transition: transform 0.3s ease;
}
</style>