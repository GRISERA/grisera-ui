<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage || 'Create a new data import'" />
        <app-breadcrumbs />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-12">
        <v-card>
          <v-card-text>
            <v-form
              ref="importForm"
              v-model="isImportFormValid"
            >
              <v-file-input
                v-model="selectedFile"
                :rules="[rules.required, rules.fileType]"
                accept=".owl,.json"
                class="mb-4"
                dense
                label="Select .owl or .json file"
                outlined
                show-size
              />
              <!--              <v-select-->
              <!--                v-model="selectedExperimentId"-->
              <!--                :items="experimentItems"-->
              <!--                item-text="name" -->
              <!--                item-value="id"-->
              <!--                label="Associate with existing Experiment (optional)"-->
              <!--                outlined-->
              <!--                dense-->
              <!--                clearable-->
              <!--                class="mb-4"-->
              <!--              ></v-select>-->
              <v-textarea
                v-model="importDescription"
                dense
                label="Description (optional)"
                outlined
                rows="3"
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-btn
              :outlined="true"
              @click="cancelCreation"
            >
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="!isImportFormValid || isUploading || !currentDatasetId"
              :loading="isUploading"
              color="#043865"
              @click="handleFileUpload"
            >
              <span style="color: white;">
                {{ currentDatasetId ? 'Submit' : 'Select Dataset First' }}
              </span>
            </v-btn>
          </v-card-actions>
        </v-card>
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
import ExperimentsAPI from '@/api/ExperimentsAPI';
import ImportAPI from '@/api/ImportAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import { mapState } from 'vuex';

export default {
  name: 'CreateImportView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
  },
  data: () => (
    {
      isImportFormValid: false,
      selectedFile: null,
      importDescription: '',
      selectedExperimentId: null,
      experiments: [],
      isUploading: false,
      snackbar: {
        show: false,
        text: '',
        color: 'info',
        timeout: 4000,
      },
      rules: {
        required: value => !!value || 'This field is required.',
        fileType: value => {
          if (!value) {
            return true;
          }
          const allowedTypes = ['owl', 'json'];
          const extension = value.name.split('.').pop().toLowerCase();
          return allowedTypes.includes(extension) || 'Only .owl and .json files are allowed.';
        },
      },
    }
  ),
  computed: {
    ...mapState({
      currentDatasetId: state => state.dataset?.id,
    }),
    experimentItems() {
      return [
        { id: null, name: 'None - Associate later or create new' },
        ...this.experiments,
      ];
    },
  },
  created() {
    this.fetchExperiments();
  },
  methods: {
    async fetchExperiments() {
      try {
        const { data } = await ExperimentsAPI.index();
        this.experiments =
          data.map(exp => (
            { id: exp.id, name: exp.name || exp.experiment_name || exp.id }
          ));
      } catch (error) {
        console.error('Error fetching experiments:', error);
        this.showSnackbar('Failed to load experiments.', 'error');
      }
    },
    async handleFileUpload() {
      if (!this.$refs.importForm.validate()) {
        return;
      }
      if (!this.selectedFile || !this.currentDatasetId) {
        this.showSnackbar('Please select a file and ensure a dataset is chosen.', 'warning');
        return;
      }

      this.isUploading = true;
      const fileExtension = this.selectedFile.name.split('.').pop().toLowerCase();

      try {
        const response = await ImportAPI.uploadFile(
          this.selectedFile,
          this.currentDatasetId,
          fileExtension,
          this.importDescription,
          this.selectedExperimentId,
        );
        this.$store.commit('addImport', {
          id: response.data.id,
          status: response.data.status,
          file_name: response.data.file_name,
          dataset_id: response.data.dataset_id,
          description: response.data.description,
          created_at: response.data.created_at,
          import_type: response.data.import_type,
        });
        this.showSnackbar(`Import ${ this.selectedFile.name } created successfully.`, 'success');
        this.$router.push({ name: 'imports' });
      } catch (error) {
        console.error('Error uploading file:', error);
        this.showSnackbar(`Error creating import: ${ error.response?.data?.detail || error.message }`, 'error');
      } finally {
        this.isUploading = false;
      }
    },
    cancelCreation() {
      this.$router.push({ name: 'imports' });
    },
    showSnackbar(text, color = 'info') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
};
</script>

<style scoped>
/* Można dodać specyficzne style dla tego widoku jeśli potrzebne */
</style> 