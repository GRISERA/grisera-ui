<template>
  <v-container v-if="participants">
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <template 
        #activator="{ on, attrs }"
        v-if="canAddParticipant"
      >
        <v-btn
          class="ma-1"
          v-bind="attrs"
          :outlined="true"
          v-on="on"
        >
          Add
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add participant</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="50"
                sm="10"
                md="10"
              >
                <v-autocomplete
                  v-model="participantId"
                  :items="participants"
                  label="Participant"
                  clearable
                  item-value="id"
                >
                  <template
                    slot="selection"
                    slot-scope="data"
                  >
                    {{ data.item?.surname }} {{ data.item?.name }}
                  </template>
                  <template
                    slot="item"
                    slot-scope="data"
                  >
                    {{ data.item?.surname }} {{ data.item?.name }}
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import ExperimentsAPI from '@/api/ExperimentsAPI';
import ParticipantsAPI from '@/api/ParticipantsAPI';

export default {
    name: 'AddExistingParticipantDialog',
    props: ['addedParticipants', 'experiment', 'canAddParticipant'],
    data: () => ({
      participants: undefined,
      participantId: null,
      dialog: false,
    }),
    watch: {
        dialog(val) {
        val || this.close();
        },
        dialogDelete(val) {
        val || this.close();
        },
    },
    created() {
      this.getParticipants();
    },
    methods: {
        close() {
          this.dialog = false;
          this.dialogDelete = false;
          this.participantId = null;
        },

        save() {
          this.addParticipantToExperiment(this.findParticipant(this.participantId));
          this.close();
        },
        
        findParticipant(id) {
          return this.participants.find((participant) => participant.id === id);
        },

        addParticipantToExperiment(participant) {
          const participantsCopy = [...(this.experiment?.participants || [])];
          participantsCopy.push(participant);
          this.participants = this.participants.filter((particip) => particip.id != participant.id);
          ExperimentsAPI.update({ ...this.experiment, participants: participantsCopy })
            .then(() => {this.$emit('participant:added'); });
        },

        getParticipants() {
            ParticipantsAPI.index()
                .then(({ data }) => {
                  if (this.addedParticipants != undefined) {
                    const addedParticipantsIds = this.addedParticipants.map((participant) => participant.id);
                    this.participants = data.filter((participant) => !addedParticipantsIds.includes(participant.id));
                  } else {
                    this.participants = data;
                  }
                });
        },
    },
};
</script>