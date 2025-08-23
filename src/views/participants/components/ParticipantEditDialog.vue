<template>
  <v-dialog 
    v-model="dialog" 
    max-width="800"
    @close="$emit('close')"
  >
    <v-card v-if="participant">
      <v-card-title class="headline primary white--text pa-4">
        <v-icon
          color="white"
          left
        >
          mdi-account-edit
        </v-icon>
        Edit Participant
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form
          ref="participantForm"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col
              cols="12"
              md="6"
              class="pa-2"
            >
              <v-text-field
                v-model="participant.name"
                label="Name"
                prepend-icon="mdi-account"
              />
            </v-col>
            
            <v-col
              cols="12"
              md="6"
              class="pa-2"
            >
              <v-text-field
                v-model="participant.surname"
                label="Surname"
                prepend-icon="mdi-account-outline"
              />
            </v-col>
            
            <v-col
              cols="12"
              md="6"
              class="pa-2"
            >
              <v-select
                v-model="participant.sex"
                :items="sexOptions"
                label="Sex"
                prepend-icon="mdi-gender-male-female"
                clearable
              />
            </v-col>
            
            <v-col
              cols="12"
              md="6"
              class="pa-2"
            >
              <v-menu
                v-model="birthDateMenu"
                :close-on-content-click="false"
                min-width="auto"
                offset-y
                transition="scale-transition"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="participant.birthDate"
                    label="Birth Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    clearable
                    @click:clear="participant.birthDate = null"
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="participant.birthDate"
                  :max="new Date().toISOString().slice(0, 10)"
                  @input="birthDateMenu = false"
                />
              </v-menu>
            </v-col>
            
            <v-col
              cols="12"
              class="pa-2"
            >
              <v-text-field
                v-model="participant.disorder"
                label="Disorder"
                prepend-icon="mdi-medical-bag"
              />
            </v-col>
          </v-row>

          <v-row 
            v-if="participant.additionalParameters && participant.additionalParameters.length > 0" 
            class="mt-2"
          >
            <v-col cols="12">
              <v-subheader>Additional Parameters</v-subheader>
              <v-divider />
            </v-col>
            <v-col
              v-for="(param, index) in participant.additionalParameters"
              :key="index"
              cols="12"
              md="6"
              class="pa-2"
            >
              <v-text-field
                v-model="param.value"
                :label="param.name"
                :prepend-icon="'mdi-tag'"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="secondary"
          text
          @click="$emit('close')"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="submitParticipant"
        >
          Save Changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ParticipantsAPI from '@/api/ParticipantsAPI';

export default {
  name: 'ParticipantEditDialog',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    participantData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      valid: true,
      participant: null,
      birthDateMenu: false,
      sexOptions: ['Male', 'Female'],
    };
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  watch: {
    participantData: {
      immediate: true,
      handler(newData) {
        this.participant = { ...newData };
      },
    },
  },
  methods: {
    submitParticipant() {
      const apiData = ParticipantsAPI.dTOFrontToAPI(this.participant);
      ParticipantsAPI.update({ ...this.participant, ...apiData })
        .then(() => {
          this.$emit('saved', this.participant);
          this.$emit('input', false);
          this.showSuccessNotification('Participant data has been updated');
        })
        .catch(error => {
          console.error('Error updating participant', error);
          this.showErrorNotification('Failed to update participant data');
        });
    },
    showSuccessNotification(message) {
      this.$emit('notification', {
        type: 'success',
        message: message,
      });
    },
    showErrorNotification(message) {
      this.$emit('notification', {
        type: 'error',
        message: message,
      });
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
</style>