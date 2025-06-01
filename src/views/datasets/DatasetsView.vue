<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage"/>
        <app-breadcrumbs/>
      </v-col>
      <v-col class="text-right">
        <v-btn
            :outlined="true"
            @click.prevent.stop="$router.push({ name: 'dataset-creation' })"
        >
          Create
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <v-container class="container--fluid">
          <v-row class="fill-height">
            <v-col
                v-for="dataset in datasets"
                :key="`dataset_${dataset.id}`"
                class="col-4 align-self-stretch"
            >
              <v-card
                  :elevation="8"
                  height="100%"
                  class="d-flex flex-column"
              >
                <v-card-text class="pa-0 flex-grow-1">
                  <v-container class="container--fluid">
                    <v-row class="wrap">
                      <v-col class="col-12">
                        <div class="caption">
                          Name
                        </div>
                        <div class="black--text font-weight-bold">
                          {{ dataset.name }}
                        </div>
                      </v-col>
                      <v-col class="col-6">
                        <div class="caption">
                          Creator
                        </div>
                        <div class="black--text">
                          {{ dataset.creator }}
                        </div>
                      </v-col>
                      <v-col class="col-6">
                        <div class="caption">
                          Date
                        </div>
                        <div class="black--text">
                          {{ dataset.date }}
                        </div>
                      </v-col>
                      <v-col class="col-12">
                        <div class="caption">
                          Rights
                        </div>
                        <div class="black--text">
                          {{ dataset.rights }}
                        </div>
                      </v-col>
                      <v-col class="col-12">
                        <div class="caption">
                          Description
                        </div>
                        <div class="black--text">
                          {{ dataset.description }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                  <v-icon
                      color="primary"
                      @click="() => {
                      selectCurrentDataset(dataset);
                      $router.push({
                        name: 'dataset-edit',
                        params: { id: dataset.id}
                      });
                    }"
                      v-if="canEditDataset(dataset.id)"
                  >
                    mdi-pen
                  </v-icon>
                  <v-spacer/>
                  <v-btn
                    color="primary"
                    @click="selectCurrentDataset(dataset)"
                  >
                    select and proceed
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    
    <input
      ref="fileInput"
      type="file"
      accept=".owl,.json"
      style="display: none"
      @change="handleFileSelect"
    />
    
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
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import AccessRoles from '@/const/AccessRoles';
import PermissionsService from '@/services/PermissionsService';
import DatasetAPI from '@/api/DatasetAPI';
import ImportAPI from '@/api/ImportAPI';
import {mapMutations, mapState, mapGetters} from 'vuex';

export default {
  name: 'DatasetsView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
  },
  data: () => {
    return {
      permissions: [],
      datasets: [],
      selectedDatasetForImport: null,
      isUploading: false,
      snackbar: {
        show: false,
        text: '',
        color: 'info',
        timeout: 4000,
      },
    };
  },
  created() {
    DatasetAPI.index().then(({data}) => {
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
      this.$router.push({name: 'main'});
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
      if (!file) return;

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
          `Import from file: ${file.name} for dataset: ${this.selectedDatasetForImport.name}`
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

        this.showSnackbar(`Plik ${file.name} został zaimportowany pomyślnie do datasetu: ${this.selectedDatasetForImport.name}`, 'success');
        console.log('Import result:', response.data);
        
        // Reset file input
        this.$refs.fileInput.value = '';
        this.selectedDatasetForImport = null;
        
      } catch (error) {
        console.error('Import error:', error);
        this.showSnackbar(`Błąd podczas importu: ${error.response?.data?.detail || error.message}`, 'error');
        
        // Reset file input
        this.$refs.fileInput.value = '';
        this.selectedDatasetForImport = null;
      } finally {
        this.isUploading = false;
      }
    },
    showSnackbar(text, color = 'info') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
};
</script>
