<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage || 'Create a new data export'" />
        <app-breadcrumbs />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-12">
        <v-card>
          <v-card-text>
            <v-form ref="exportForm" v-model="isExportFormValid">
              <!-- Export Format -->
              <v-select
                v-model="selectedFormat"
                :items="formatItems"
                :rules="[rules.required]"
                class="mb-4"
                dense
                disabled
                item-text="label"
                item-value="value"
                label="Export Format"
                outlined
                prepend-icon="mdi-file-export-outline"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-icon>
                    <v-icon>{{ getFormatIcon(item.value) }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.label }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-select>


              <!-- Description -->
              <v-textarea
                v-model="exportDescription"
                dense
                label="Description (optional)"
                outlined
                prepend-icon="mdi-text-box-outline"
                rows="3"
              ></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-btn
              :outlined="true"
              @click="cancelCreation"
            >
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!isExportFormValid || isCreating || !currentDatasetId"
              :loading="isCreating"
              color="#043865"
              @click="handleExportCreation"
            >
              <span style="color: white;">
                {{ currentDatasetId ? 'Start Export' : 'Select Dataset First' }}
              </span>
            </v-btn>
          </v-card-actions>
        </v-card>
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
import { mapState } from 'vuex';

export default {
  name: 'CreateExportView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
  },
  data: () => (
    {
      isExportFormValid: false,
      selectedFormat: 'json',
      exportDescription: '',
      isCreating: false,
      snackbar: {
        show: false,
        text: '',
        color: 'info',
        timeout: 4000,
      },
      formatItems: [
        { value: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
        { value: 'csv', label: 'CSV', description: 'Comma Separated Values' },
        { value: 'xml', label: 'XML', description: 'Extensible Markup Language' },
      ],
      rules: {
        required: value => !!value || 'This field is required.',
      },
    }
  ),
  computed: {
    ...mapState({
      currentDatasetId: state => state.dataset?.id,
    }),
  },
  methods: {
    async handleExportCreation() {
      if (!this.$refs.exportForm.validate()) {
        return;
      }
      if (!this.currentDatasetId) {
        this.showSnackbar('Please ensure a dataset is chosen.', 'warning');
        return;
      }

      this.isCreating = true;

      try {
        const exportData = {
          file_name: `export_${ this.selectedFormat }_${ Date.now() }`,
          file_type: this.selectedFormat,
          operation_type: 'export',
          dataset_id: this.currentDatasetId,
          description: this.exportDescription,
        };

        console.log('Creating export with data:', exportData);

        const response = await ExportAPI.startExport(exportData);

        // FileOperationOut używa file_type zamiast export_format
        this.$store.commit('addExport', {
          id: response.data.id,
          status: response.data.status,
          export_format: response.data.file_type || this.selectedFormat, // Zachowaj nazwę dla store compatibility
          dataset_id: response.data.dataset_id,
          description: response.data.description,
          created_at: response.data.created_at,
          exported_records: response.data.processed_records || 0,
        });

        this.showSnackbar(`Export ${ this.selectedFormat.toUpperCase() } created successfully.`, 'success');
        this.$router.push({ name: 'exports' });
      } catch (error) {
        console.error('Error creating export:', error);
        this.showSnackbar(`Error creating export: ${ error.response?.data?.detail || error.message }`, 'error');
      } finally {
        this.isCreating = false;
      }
    },
    cancelCreation() {
      this.$router.push({ name: 'exports' });
    },
    showSnackbar(text, color = 'info') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    getFormatIcon(format) {
      switch (format) {
        case 'json':
          return 'mdi-code-json';
        case 'csv':
          return 'mdi-file-delimited-outline';
        case 'xml':
          return 'mdi-xml';
        default:
          return 'mdi-file-export-outline';
      }
    },
  },
};
</script>

<style scoped>
/* Można dodać specyficzne style dla tego widoku jeśli potrzebne */
</style>
