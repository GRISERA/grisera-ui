<template>
  <v-dialog
    v-model="dialog"
    max-width="600px"
    persistent
  >
    <template
      v-if="canAddParticipant"
      #activator="{ on, attrs }"
    >
      <create-button
        class="ma-4"
        data-testid="experiment-participant-add-button"
        text="Add Participant"
        v-bind="attrs"
        v-on="on"
      />
    </template>
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
        Add Participant to Experiment
      </v-card-title>

      <v-card-text class="pa-6">
        <v-alert
          border="left"
          class="mb-4"
          color="info"
          colored-border
          elevation="2"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-3">
              mdi-information-outline
            </v-icon>
            <div>
              <strong>Note:</strong> Only participants not yet assigned to this experiment are shown in the list below.
            </div>
          </div>
        </v-alert>

        <v-form
          ref="form"
          v-model="formValid"
          lazy-validation
        >
          <v-autocomplete
            v-model="participantId"
            :items="participants"
            :loading="loading"
            :rules="participantRules"
            class="mb-4"
            clearable
            item-value="id"
            label="Select Participant"
            outlined
            placeholder="Choose a participant to add"
            prepend-inner-icon="mdi-account"
          >
            <template #selection="{ item }">
              <v-chip
                color="primary"
                small
                text-color="white"
              >
                <v-icon
                  left
                  small
                >
                  mdi-account
                </v-icon>
                {{ item?.surname }} {{ item?.name }}
              </v-chip>
            </template>
            <template #item="{ item }">
              <v-list-item-avatar>
                <v-icon>mdi-account</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item?.surname }} {{ item?.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item?.sex }} • Born: {{ item?.birthDate || 'Unknown' }}</v-list-item-subtitle>
              </v-list-item-content>
            </template>
            <template #no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ loading ? 'Loading participants...' : 'No available participants found' }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-form>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-6">
        <v-btn
          outlined
          @click="close"
        >
          <v-icon left>
            mdi-close
          </v-icon>
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="!formValid || !participantId"
          :loading="loading"
          color="primary"
          @click="save"
        >
          <v-icon left>
            mdi-plus
          </v-icon>
          Assign to experiment
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import ExperimentsAPI from '@/api/ExperimentsAPI';
import ParticipantsAPI from '@/api/ParticipantsAPI';
import CreateButton from '@/components/CreateButton.vue';

export default {
  name: 'AddExistingParticipantDialog',
  components: {
    CreateButton,
  },
  props: ['experiment', 'canAddParticipant'],
  data() {
    return {
      participants: [],
      participantId: null,
      dialog: false,
      loading: false,
      formValid: false,
    };
  },
  computed: {
    participantRules() {
      return [
        v => !!v || 'Please select a participant',
      ];
    },
  },
  watch: {
    dialog(newValue) {
      if (newValue) {
        this.getParticipants();
    this.resetForm();
      } else {
        this.close();
      }
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.participantId = null;
      this.resetForm();
    },

    resetForm() {
      this.participantId = null;
      this.formValid = false;
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },

    async save() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.loading = true;
      try {
        const participant = this.findParticipant(this.participantId);
        await this.addParticipantToExperiment(participant);
        this.close();
      } catch (error) {
        console.error('Error adding participant:', error);
      } finally {
        this.loading = false;
      }
    },

    findParticipant(id) {
      return this.participants.find((participant) => participant.id === id);
    },

    async addParticipantToExperiment(participant) {
      // Get current participants IDs and add the new one
      const participantsIdsCopy = [
        ...(
          this.experiment?.participants_ids || []
        ),
      ];
      participantsIdsCopy.push(participant.id);

      // Fetch all participant objects for the API call
      const participantObjects = await Promise.all(
        participantsIdsCopy.map(async (participantId) => {
          if (participantId === participant.id) {
            return participant; // Use the participant we already have
          }
          const { data } = await ParticipantsAPI.show(participantId);
          return data;
        }),
      );

      const updatedExperiment = {
        ...this.experiment,
        participants: participantObjects,
      };

      await ExperimentsAPI.update(updatedExperiment);
      this.$emit('participant:added');
    },

    async getParticipants() {
      this.loading = true;
      try {
        const { data } = await ParticipantsAPI.index();
        const experimentParticipantIds = this.experiment?.participants_ids || [];
        this.participants = data.filter((participant) => !experimentParticipantIds.includes(participant.id));
      } catch (error) {
        console.error('Error fetching participants:', error);
        this.participants = [];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>