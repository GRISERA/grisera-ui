<template>
  <base-table
    :headers="headers"
    :items="dataToDisplay"
    :show-expand="true"
  >
    <template #expanded-item="{ item }">
      <td :colspan="6">
        <v-container class="container--fluid px-0">
          <div
            class="caption font-weight-bold"
            style="color: rgb(0,0,0, .6)"
          >
            Description
          </div>
          {{ item.description }}
          <br>
          <br>
          <recordings-sub-table
            :data-to-display="item"
          />
          <br>
        </v-container>
      </td>
    </template>
    <template #actions="{ item }">
      <v-icon
        class="mr-2"
        color="primary"
        @click.stop.prevent="download(item)"
      >
        mdi-download
      </v-icon>
      <v-icon
        class="mr-2"
        color="primary"
        @click.stop.prevent="goToEdition(item)"
        v-if="canEditAndDelete"
      >
        mdi-pen
      </v-icon>
      <v-icon
        color="error"
        @click.stop.prevent="$emit('recordings:delete', item)"
        v-if="canEditAndDelete"
      >
        mdi-delete
      </v-icon>
    </template>
  </base-table>
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import RecordingsSubTable from './RecordingsSubTable.vue';

export default {
  name: 'ModalitiesTable',
  components: {
    BaseTable,
    RecordingsSubTable,
  },
  props: {
    experiment: {
      type: Object,
      default: () => ({}),
    },
    dataToDisplay: {
      type: Array,
      default: () => [],
    },
    canEditAndDelete: Boolean,
  },
  data() {
    return {
      headers: [
        { text: 'Registered Data ID', value: 'registeredDataId', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Scenario Execution', value: 'scenarioExecution_name' },
        { text: 'Activity Execution', value: 'activityExecution_name' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    download(item) {
      this.downloadFile(item);
    },
    goToEdition(item) {
      this.$router.push({
        name: 'experiment-recording-edit',
        params: {
          id: item.registeredDataId,
          experiment: this.experiment.id,
        },
      });
    },
    async downloadFile(allInfo) {
      const link = document.createElement('a');
      link.href = allInfo.link;
      link.download = '';
      link.click();
    },
  },
};
</script>
    