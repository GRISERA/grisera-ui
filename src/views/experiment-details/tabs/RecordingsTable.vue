<template>
  <base-table
    :headers="headers"
    :items="dataToDisplay"
    :show-expand="true"
  >
    <template #[`item.link`]="{ item }">
      <td v-if="item.link">
        {{ preparedLink(item.link) }}
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-icon
              color="primary"
              v-bind="attrs"
              v-on="on"
              @click.stop.prevent="downloadFile(item)"
            >
              mdi-file-find
            </v-icon>
          </template>
          <span>Click to preview</span>
        </v-tooltip>
      </td>
    </template>
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
        v-if="canEditAndDelete"
        class="mr-2"
        color="primary"
        @click.stop.prevent="goToEdition(item)"
      >
        mdi-pen
      </v-icon>
      <v-icon
        v-if="canEditAndDelete"
        color="error"
        @click.stop.prevent="$emit('recordings:delete', item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </base-table>
</template>

<script>
import RegisteredDataAPI from '@/api/RegisteredDataAPI';
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
      default: () => (
        {}
      ),
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
        { text: 'Linked file', value: 'link' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    goToEdition(item) {
      this.$router.push({
        name: 'experiment-recording-edit',
        params: {
          id: item.registeredDataId,
          experiment: this.experiment.id,
        },
      });
    },
    async downloadFile(item) {
      const response = await RegisteredDataAPI.getPreviewUrl(item.link);
      window.open(response.data.preview_url, '_blank');
    },
    preparedLink(link) {
      return link.split('/').pop();
    },
  },
};
</script>
