<template>
  <v-row>
    <v-col class="col-12 pa-6">
      <base-table
        :headers="headers"
        :items="participants"
      >
        <template #[`item.sex`]="{ item }">
          <v-chip
            color="primary"
            :small="true"
          >
            {{ item.sex }}
          </v-chip>
        </template>
        <template #actions="{ item }">
          <v-btn icon>
            <v-icon
              color="grey lighten-1"
              @click="goToManagingParticipant(executionId, item.id)"
            >
              mdi-information
            </v-icon>
          </v-btn>
          <v-btn
            outlined
            small
            @click="goToTimeSeries(executionId, item.id)"
          >
            Time Series
          </v-btn>
        </template>
      </base-table>
    </v-col>
  </v-row>
</template>
<script>
import BaseTable from '@/components/base/BaseTable.vue';

export default {
  name: 'ActivityExecutionsParticipantTableComponent',
  components: {
    BaseTable,
  },
  props: {
    executionId: {
      type: Number,
      default: () => (0),
    },
    participants: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Surname', value: 'surname' },
        { text: 'Birth date', value: 'birthDate' },
        { text: 'Sex', value: 'sex' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    goToManagingParticipant(executionId, participantId) {
      const currentRoute = this.$router.currentRoute.path;
      const append = `/activity-executions/${executionId}/participants/${participantId}`;

      this.$router.push(currentRoute + append);
    },
    goToTimeSeries(executionId, participantId) {
      const currentRoute = this.$router.currentRoute.path;
      const append = `/activity-executions/${executionId}/participants/${participantId}/time-series`;

      this.$router.push(currentRoute + append);
    },
  },
};
</script>