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
          data-testid="upload-file-button"
          @click="uploadDialog = true"
        >
          <v-icon left>
            mdi-upload
          </v-icon>
          Upload File
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <v-data-table
          :headers="headers"
          :items="files"
          :loading="loading"
          class="elevation-1"
          data-testid="files-table"
        >
          <template #[`item.size`]="{ item }">
            {{ formatFileSize(item.size) }}
          </template>
          <template #[`item.uploadedAt`]="{ item }">
            {{ formatDate(item.uploadedAt) }}
          </template>
          <template #[`item.actions`]="{ item }">
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-icon
                  class="mr-2"
                  color="primary"
                  data-testid="preview-file-button"
                  small
                  v-bind="attrs"
                  @click="previewFile(item)"
                  v-on="on"
                >
                  mdi-eye
                </v-icon>
              </template>
              <span>Preview in new tab</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-icon
                  class="mr-2"
                  color="success"
                  data-testid="download-file-button"
                  small
                  v-bind="attrs"
                  @click="downloadFile(item)"
                  v-on="on"
                >
                  mdi-download
                </v-icon>
              </template>
              <span>Download file</span>
            </v-tooltip>
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-icon
                  color="error"
                  data-testid="delete-file-button"
                  small
                  v-bind="attrs"
                  @click="openDeleteConfirmDialog(item)"
                  v-on="on"
                >
                  mdi-delete
                </v-icon>
              </template>
              <span>Delete file</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Upload Dialog -->
    <v-dialog
      v-model="uploadDialog"
      data-testid="upload-dialog"
      max-width="500px"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="headline">Upload File</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="uploadForm">
            <v-file-input
              v-model="selectedFile"
              :rules="[v => !!v || 'File is required']"
              label="Select file"
              outlined
              prepend-icon="mdi-paperclip"
              show-size
              @change="validateFile"
            />
            <v-text-field
              v-model="fileName"
              :rules="[v => !!v || 'File name is required']"
              label="File name"
              outlined
              placeholder="Enter name for the file"
              prepend-icon="mdi-rename-box"
            />
            <v-alert
              v-if="fileTypeWarning"
              dense
              type="warning"
            >
              {{ fileTypeWarning }}
            </v-alert>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey darken-1"
            data-testid="upload-cancel-button"
            text
            @click="closeUploadDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            :loading="uploading"
            color="primary"
            data-testid="upload-submit-button"
            @click="uploadFile"
          >
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm Dialog -->
    <delete-confirm-dialog
      :active.sync="deleteConfirmDialogActive"
      title="Delete file?"
      @cancel="closeDeleteConfirmDialog"
      @submit="deleteFile"
    >
      <div class="py-4">
        Are you sure you want to delete <strong>{{ fileToDelete?.name || fileToDelete?.originalFilename }}</strong>?
        <br><br>
        This action cannot be undone.
      </div>
    </delete-confirm-dialog>
  </v-container>
</template>

<script>
import FilesAPI from '@/api/FilesAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import DeleteConfirmDialog from '@/components/dialog/DeleteConfirmDialog.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import { format } from 'date-fns';

export default {
  name: 'FilesView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
    DeleteConfirmDialog,
  },
  data() {
    return {
      files: [],
      loading: true,
      uploading: false,
      uploadDialog: false,
      deleteConfirmDialogActive: false,
      selectedFile: null,
      fileName: null,
      fileToDelete: null,
      fileTypeWarning: '',
      archiveExtensions: ['zip', 'tar', 'gz', 'tgz'],
      headers: [
        { text: 'Display Name', value: 'name', sortable: true },
        { text: 'Original Filename', value: 'originalFilename', sortable: true },
        { text: 'Size', value: 'size', sortable: true },
        { text: 'Type', value: 'contentType', sortable: true },
        { text: 'Uploaded', value: 'uploadedAt', sortable: true },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  created() {
    this.loadFiles();
  },
  methods: {
    validateFile() {
      if (!this.selectedFile) {
        return;
      }

      const fileName = this.selectedFile.name.toLowerCase();
      let isArchive = false;
      let archiveType = '';

      // Check for archive types
      if (fileName.endsWith('.tar.gz') || fileName.endsWith('.tgz')) {
        isArchive = true;
        archiveType = fileName.endsWith('.tar.gz') ? 'tar.gz' : 'tgz';
      } else {
        const extension = fileName.split('.').pop();
        if (this.archiveExtensions.includes(extension)) {
          isArchive = true;
          archiveType = extension;
        }
      }

      // Reset warning
      this.fileTypeWarning = '';

      // Add warning for archives
      if (isArchive) {
        this.fileTypeWarning = `You are uploading an archive (${ archiveType }). All files inside will be extracted recursively.`;
      }

      // Set default file name if not provided
      if (!this.fileName) {
        // Remove extension for file name
        if (fileName.endsWith('.tar.gz')) {
          this.fileName = this.selectedFile.name.slice(0, -7); // Remove .tar.gz
        } else if (fileName.endsWith('.tgz')) {
          this.fileName = this.selectedFile.name.slice(0, -4); // Remove .tgz
        } else {
          this.fileName = this.selectedFile.name.replace(/\.[^/.]+$/, '');
        }
      }
    },
    async loadFiles() {
      try {
        const { data } = await FilesAPI.index();
        this.files = data;
      } catch (error) {
        console.error('Error loading files:', error);
      } finally {
        this.loading = false;
      }
    },
    async uploadFile() {
      if (this.$refs.uploadForm.validate()) {
        this.uploading = true;
        try {
          // Przygotuj FormData
          const formData = new FormData();
          formData.append('file', this.selectedFile);

          // Nazwa pliku - opcjonalna, bo API doda domyślną
          if (this.fileName) {
            formData.append('name', this.fileName);
          }

          // Wywołaj upload
          await FilesAPI.upload(formData);

          this.closeUploadDialog();
          this.loadFiles();
        } catch (error) {
          console.error('Error uploading file:', error);
        } finally {
          this.uploading = false;
        }
      }
    },
    closeUploadDialog() {
      this.uploadDialog = false;
      this.selectedFile = null;
      this.fileName = null;
      this.fileTypeWarning = '';
      // Reset form validation
      this.$nextTick(() => {
        if (this.$refs.uploadForm) {
          this.$refs.uploadForm.resetValidation();
        }
      });
    },
    async previewFile(file) {
      try {
        const response = await FilesAPI.getPreviewUrl(file.id);
        window.open(response.data.preview_url, '_blank');
      } catch (error) {
        console.error('Error previewing file:', error);
        // Fallback to old method if preview URL fails
        try {
          const fallbackResponse = await FilesAPI.preview(file.id);
          const blob = new Blob([fallbackResponse.data], { type: file.contentType });
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          // Clean up the URL after a short delay
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } catch (fallbackError) {
          console.error('Error with fallback preview:', fallbackError);
        }
      }
    },
    async downloadFile(file) {
      try {
        const response = await FilesAPI.download(file.id);
        const { download_url, filename } = response.data;

        // Create temporary link to trigger download
        const link = document.createElement('a');
        link.href = download_url;
        link.setAttribute('download', filename);
        link.target = '_blank'; // Open in new tab as fallback
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    },
    openDeleteConfirmDialog(file) {
      this.fileToDelete = file;
      this.deleteConfirmDialogActive = true;
    },
    closeDeleteConfirmDialog() {
      this.fileToDelete = null;
      this.deleteConfirmDialogActive = false;
    },
    async deleteFile() {
      if (this.fileToDelete) {
        try {
          await FilesAPI.delete(this.fileToDelete.id);
          this.loadFiles();
          this.closeDeleteConfirmDialog();
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) {
        return '0 Bytes';
      }
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((
        bytes / Math.pow(k, i)
      ).toFixed(2)) + ' ' + sizes[i];
    },
    formatDate(dateString) {
      if (!dateString) {
        return '';
      }
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    },
  },
};
</script>

<style scoped>
.file-upload-warning {
  margin-top: 10px;
}
</style>