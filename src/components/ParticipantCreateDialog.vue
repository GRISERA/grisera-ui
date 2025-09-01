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
          mdi-account-plus
        </v-icon>
        Create New Participant
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form
          ref="form"
          v-model="formValid"
          lazy-validation
        >
          <v-text-field
            v-model="participant.name"
            :rules="nameRules"
            class="mb-4"
            label="Name"
            outlined
            placeholder="Enter participant name"
            prepend-inner-icon="mdi-account"
          />

          <v-select
            v-model="participant.sex"
            :items="sexOptions"
            class="mb-4"
            clearable
            label="Sex"
            outlined
            placeholder="Select participant sex"
            prepend-inner-icon="mdi-gender-male-female"
          />

          <v-dialog
            ref="dateDialog"
            v-model="dateModal"
            :return-value.sync="participant.birthDate"
            persistent
            width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="formattedDate"
                class="mb-4"
                label="Birth Date"
                outlined
                placeholder="Select birth date (optional)"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="participant.birthDate"
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
                @click="$refs.dateDialog.save(participant.birthDate)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>

          <v-text-field
            v-model="participant.disorder"
            class="mb-4"
            clearable
            label="Disorder"
            outlined
            placeholder="Enter disorder (optional)"
            prepend-inner-icon="mdi-medical-bag"
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
          @click="createParticipant"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          Create Participant
        </v-btn>
      </v-card-actions>
    </v-card>

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
import ParticipantsAPI from '@/api/ParticipantsAPI';

export default {
  name: 'ParticipantCreateDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      participant: {
        name: '',
        sex: '',
        birthDate: null,
        disorder: '',
      },
      dateModal: false,
      loading: false,
      formValid: false,
      sexOptions: ['Male', 'Female'],
      confirmDialog: false,
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
    today() {
      return new Date().toISOString().substr(0, 10);
    },
    formattedDate() {
      if (!this.participant.birthDate) {
        return '';
      }
      const date = new Date(this.participant.birthDate);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    nameRules() {
      return [
        v => !!v || 'Name is required',
        v => (
          v && v.length >= 2
        ) || 'Name must be at least 2 characters',
        v => (
          v && v.length <= 50
        ) || 'Name must be less than 50 characters',
      ];
    },
  },
  watch: {
    dialog(newValue) {
      if (newValue) {
        this.resetForm();
      }
    },
  },
  methods: {
    async createParticipant() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.loading = true;

      try {
        await ParticipantsAPI.store(this.participant);
        await this.$emit('participant-created');
        this.dialog = false;
      } catch (error) {
        console.error('Error creating participant:', error);
        this.$emit('participant-error', error.response?.data?.message || 'An error occurred while creating the participant');
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
      const { name, sex, birthDate, disorder } = this.participant;
      return !!(
        name || sex || birthDate || disorder
      );
    },
    resetForm() {
      this.participant = {
        name: '',
        sex: '',
        birthDate: null,
        disorder: '',
      };
      this.formValid = false;
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>