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
import IndexedDB from '@/storage/IndexedDB';
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
        { text: 'ID', value: 'id', sortable: false },
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
          id: item.id,
          experiment: this.experiment.id,
        },
      });
    },
    async loadFileFromIndexedDB(key) {
      const fileData = await IndexedDB.readFileFromIndexedDB(key);
      if (fileData) {
        return fileData;
      } else {
        console.log('No file found in IndexedDB.');
      }
    },
    async downloadFile(allInfo) {
      var id = allInfo.id.toString() + '_';
      var key = id + '0';
      var fileLoaded = await this.loadFileFromIndexedDB(key);
      const fileUrl = URL.createObjectURL(fileLoaded.file);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = '';
      link.click();
    },
  },
};
</script>
    