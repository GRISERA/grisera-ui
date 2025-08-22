<template>
  <div>
    <base-table
      :headers="headers"
      :items="participants"
      :show-expand="true"
    >
      <template #[`item.sex`]="{ item }">
        <v-chip
          :small="true"
          color="primary"
        >
          {{ item.sex }}
        </v-chip>
      </template>
      
      <template #actions="{ item }">
        <v-icon
          class="mr-2"
          color="primary"
          @click.stop.prevent="openEditDialog(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
      
      <template #expanded-item="{ item }">
        <td :colspan="5">
          <horizontal-text-divider text="Additional parameters" />
          <v-col
            v-for="additionalParameter in item.additionalParameters"
            :key="`participant_${item.id}_additional_parameter_${additionalParameter.key}`"
            class="col-3"
          >
            <div
              class="caption font-weight-bold"
              style="color: rgb(0,0,0, .6)"
            >
              {{ additionalParameter.name }}
            </div>
            {{ additionalParameter.value }}
          </v-col>
        </td>
      </template>
    </base-table>

    <participant-edit-dialog
      v-model="editDialog"
      :participant-data="selectedParticipant"
      @saved="onParticipantSaved"
      @close="editDialog = false"
      @notification="handleNotification"
    />

    <v-snackbar
      v-model="snackbar"
      :color="notificationType"
      timeout="3000"
    >
      {{ notificationMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import ParticipantsAPI from '@/api/ParticipantsAPI';
import BaseTable from '@/components/base/BaseTable.vue';
import HorizontalTextDivider from '@/components/divider/HorizontalTextDivider.vue';
import ParticipantEditDialog from './ParticipantEditDialog.vue';

export default {
  name: 'ParticipantsTable',
  components: {
    HorizontalTextDivider,
    BaseTable,
    ParticipantEditDialog,
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Surname', value: 'surname' },
        { text: 'Birth date', value: 'birthDate' },
        { text: 'Sex', value: 'sex' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      participants: [],
      editDialog: false,
      selectedParticipant: null,
      snackbar: false,
      notificationType: '',
      notificationMessage: '',
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
    handleNotification(notification) {
      this.snackbar = true;
      this.notificationType = notification.type === 'success' ? 'success' : 'error';
      this.notificationMessage = notification.message;
    },
  },
};
</script>