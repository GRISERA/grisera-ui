<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    persistent
  >
    <v-card
      class="elevation-4"
      rounded="lg"
    >
      <v-card-title class="primary white--text">
        <v-icon
          color="white"
          left
        >
          {{ isEditMode ? 'mdi-pencil' : 'mdi-database-plus' }}
        </v-icon>
        {{ isEditMode ? 'Edit Dataset' : 'Create New Dataset' }}
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form
          ref="form"
          v-model="formValid"
          lazy-validation
        >
          <v-text-field
            v-model="dataset.name"
            :rules="nameRules"
            class="mb-4"
            counter="100"
            label="Dataset Name"
            maxlength="100"
            outlined
            placeholder="Enter dataset name"
            prepend-inner-icon="mdi-database"
          />

          <v-text-field
            v-model="dataset.creator"
            class="mb-4"
            counter="50"
            label="Creator"
            maxlength="50"
            outlined
            placeholder="Enter creator name (optional)"
            prepend-inner-icon="mdi-account"
          />

          <v-text-field
            v-model="dataset.rights"
            class="mb-4"
            label="Rights"
            outlined
            placeholder="Enter rights information (optional)"
            prepend-inner-icon="mdi-shield-check"
          />

          <v-dialog
            ref="dateDialog"
            v-model="dateModal"
            :return-value.sync="dataset.date"
            persistent
            width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="formattedDate"
                class="mb-4"
                label="Creation Date"
                outlined
                placeholder="Select creation date (optional)"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="dataset.date"
              :max="today"
              color="primary"
              scrollable
            >
              <v-spacer />
              <v-btn
                text
                @click="dateModal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                text
                @click="$refs.dateDialog.save(dataset.date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>

          <v-textarea
            v-model="dataset.description"
            counter="500"
            label="Description"
            maxlength="500"
            no-resize
            outlined
            placeholder="Enter dataset description (optional)"
            prepend-inner-icon="mdi-text"
            rows="4"
          />
        </v-form>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-6">
        <v-btn
          outlined
          @click="handleCancel"
        >
          <v-icon left>
            mdi-close
          </v-icon>
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="!formValid"
          :loading="loading"
          color="primary"
          @click="createDataset"
        >
          <v-icon left>
            {{ isEditMode ? 'mdi-content-save' : 'mdi-plus' }}
          </v-icon>
          {{ isEditMode ? 'Update Dataset' : 'Create Dataset' }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Confirmation Dialog -->
    <v-dialog
      v-model="confirmDialog"
      max-width="420px"
    >
      <v-card rounded="lg">
        <v-card-title class="warning white--text pa-4">
          <v-icon
            color="white"
            left
          >
            mdi-alert
          </v-icon>
          Unsaved Changes
        </v-card-title>
        <v-card-text class="pa-6">
          <p class="mb-0">
            You have unsaved changes. Are you sure you want to close without saving?
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            outlined
            @click="confirmDialog = false"
          >
            Keep Editing
          </v-btn>
          <v-btn
            color="warning"
            @click="forceClose"
          >
            <v-icon left>
              mdi-close
            </v-icon>
            Close Anyway
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import DatasetAPI from '@/api/DatasetAPI';
import AccessRoles from '@/const/AccessRoles';
import PermissionsService from '@/services/PermissionsService';
import { mapState } from 'vuex';
import config from '../../config.js';

export default {
  name: 'DatasetDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    editDataset: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dataset: {
        name: '',
        creator: '',
        rights: '',
        date: new Date().toISOString().substr(0, 10),
        description: '',
      },
      dateModal: false,
      loading: false,
      formValid: false,
      confirmDialog: false,
      originalDataset: null,
    };
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
    isEditMode() {
      return !!this.editDataset;
    },
    ...mapState({
      user: state => state.user,
    }),
    today() {
      return new Date().toISOString().substr(0, 10);
    },
    formattedDate() {
      if (!this.dataset.date) {
        return '';
      }
      const date = new Date(this.dataset.date);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    nameRules() {
      return [
        v => !!v || 'Dataset name is required',
        v => (
          v && v.length >= 3
        ) || 'Name must be at least 3 characters',
        v => (
          v && v.length <= 100
        ) || 'Name must be less than 100 characters',
      ];
    },
    tokenExpiration() {
      return new Date().getTime() + config.sessionDurationMinutes * 60000;
    },
  },
  watch: {
    dialog(newValue) {
      if (newValue) {
        this.resetForm();
      }
    },
    editDataset: {
      handler(newDataset) {
        if (newDataset) {
          this.dataset = { ...newDataset };
          this.originalDataset = { ...newDataset };
        }
      },
      immediate: true,
    },
  },
  methods: {
    async createDataset() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.loading = true;

      try {
        if (this.isEditMode) {
          const { data } = await DatasetAPI.update(this.dataset);
          this.$emit('dataset-updated', data);
        } else {
          const { data } = await DatasetAPI.store(this.dataset);
          const permissionResponse = await PermissionsService.add({
            userId: this.user.userId,
            datasetId: data.id,
            role: AccessRoles.OWNER,
          });

          localStorage.setItem('token', permissionResponse.data.token);
          localStorage.setItem('tokenExpiration', this.tokenExpiration);
          this.$emit('dataset-created', data);
        }

        this.dialog = false;
      } catch (error) {
        console.error('Error saving dataset:', error);
        const errorMessage = this.isEditMode
          ? 'An error occurred while updating the dataset'
          : 'An error occurred while creating the dataset';
        this.$emit('dataset-error', error.response?.data?.message || errorMessage);
      } finally {
        this.loading = false;
      }
    },
    handleCancel() {
      if (this.hasUnsavedChanges()) {
        this.confirmDialog = true;
      } else {
        this.dialog = false;
      }
    },
    forceClose() {
      this.confirmDialog = false;
      this.dialog = false;
    },
    hasUnsavedChanges() {
      if (this.isEditMode && this.originalDataset) {
        // In edit mode, compare current values with original
        return (
          this.dataset.name !== this.originalDataset.name ||
          this.dataset.creator !== this.originalDataset.creator ||
          this.dataset.rights !== this.originalDataset.rights ||
          this.dataset.date !== this.originalDataset.date ||
          this.dataset.description !== this.originalDataset.description
        );
      } else {
        // In create mode, check if any field has content
        const { name, creator, rights, description } = this.dataset;
        return !!(
          name || creator || rights || description
        );
      }
    },
    resetForm() {
      if (this.isEditMode && this.editDataset) {
        this.dataset = { ...this.editDataset };
        this.originalDataset = { ...this.editDataset };
      } else {
        this.dataset = {
          name: '',
          creator: '',
          rights: '',
          date: new Date().toISOString().substr(0, 10),
          description: '',
        };
        this.originalDataset = null;
      }
      this.formValid = false;
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
  },
};
</script>