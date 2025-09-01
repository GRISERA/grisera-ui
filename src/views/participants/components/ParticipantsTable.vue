<template>
  <div>
    <!-- Empty State -->
    <empty-state
      v-if="participants.length === 0"
      action-icon="mdi-plus"
      action-text="Create Your First Participant"
      description="There are no participants in the system yet. Create your first participant to get started."
      icon="mdi-account-group-outline"
      title="No Participants Found"
      @action="createParticipant"
    />

    <!-- Participants Table -->
    <base-table
      v-else
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
    <participant-create-dialog
      v-model="createDialog"
      @participant-created="onParticipantCreated"
    />
  </div>
</template>

<script>
import ParticipantsAPI from '@/api/ParticipantsAPI';
import BaseTable from '@/components/base/BaseTable.vue';
import EmptyState from '@/components/EmptyState.vue';
import ParticipantCreateDialog from '@/components/ParticipantCreateDialog.vue';
import aclMixin from '@/mixins/acl-mixin';
import ParticipantEditDialog from './ParticipantEditDialog.vue';

export default {
  name: 'ParticipantsTable',
  components: {
    BaseTable,
    EmptyState,
    ParticipantEditDialog,
    ParticipantCreateDialog,
  },
  mixins: [
    aclMixin,
  ],
  props: {
    initialParticipants: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      headers: [
        { text: 'External ID', value: 'external_id', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Birth date', value: 'birthDate' },
        { text: 'Sex', value: 'sex' },
        { text: 'Disorder', value: 'disorder' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      participants: [],
      editDialog: false,
      selectedParticipant: null,
      createDialog: false,
    };
  },
  watch: {
    initialParticipants: {
      immediate: true,
      handler(participants) {
        this.participants = participants;
      },
    },
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
    createParticipant() {
      this.createDialog = true;
    },
    onParticipantCreated() {
      this.fetchParticipants();
      this.createDialog = false;
    },
  },
};
</script>