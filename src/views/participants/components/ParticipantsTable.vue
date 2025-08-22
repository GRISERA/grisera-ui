<template>
  <div>
    <base-table
      :headers="headers"
      :items="participants"
    >
      <template #[`item.sex`]="{ item }">
        <v-chip
          v-if="item.sex"
          :small="true"
          color="primary"
        >
          {{ item.sex }}
        </v-chip>
        <span v-else>-</span>
      </template>
      <template
        v-if="aclCan(aclName.PARTICIPANT.EDIT)"
        #actions="{ item }"
      >
        <v-icon
          class="mr-2"
          color="primary"
          @click.stop.prevent="openEditDialog(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
    </base-table>

    <participant-edit-dialog
      v-if="selectedParticipant"
      v-model="editDialog"
      :participant-data="selectedParticipant"
      @close="editDialog = false"
      @saved="onParticipantSaved"
    />
  </div>
</template>

<script>
import ParticipantsAPI from '@/api/ParticipantsAPI';
import BaseTable from '@/components/base/BaseTable.vue';
import aclMixin from '@/mixins/acl-mixin';
import ParticipantEditDialog from './ParticipantEditDialog.vue';

export default {
  name: 'ParticipantsTable',
  components: {
    BaseTable,
    ParticipantEditDialog,
  },
  mixins: [
    aclMixin,
  ],
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Surname', value: 'surname' },
        { text: 'Birth date', value: 'birthDate' },
        { text: 'Sex', value: 'sex' },
        { text: 'Disorder', value: 'disorder' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      participants: [],
      editDialog: false,
      selectedParticipant: null,
    };
  },
  created() {
    this.fetchParticipants();
  },
  methods: {
    fetchParticipants() {
      ParticipantsAPI.index()
        .then(({ data }) => {
          this.participants = data;
        });
    },
    openEditDialog(participant) {
      this.selectedParticipant = { ...participant };
      this.editDialog = true;
    },
    onParticipantSaved(updatedParticipant) {
      const index = this.participants.findIndex(p => p.id === updatedParticipant.id);
      if (index !== -1) {
        this.$set(this.participants, index, updatedParticipant);
      }
    },
  },
};
</script>