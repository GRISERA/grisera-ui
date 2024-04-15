<template>
  <v-row>
    <v-col class="col-12 pa-6">
      <base-table
        :headers="headersObservableInformations"
        :items="observableInformations"
      >
        <template #[`item.recording`]="{ item }">
          <td>
            {{ item.file.recordingName }}
          </td>
        </template>
        <template #[`item.file`]="{ item }">
          <td>
            {{ item.file.file.name }}
          </td>
        </template>
        <template #[`item.channel`]="{ item }">
          <td>
            {{ item.channel.name }}
          </td>
        </template>
        <template #[`item.modality`]="{ item }">
          <td>
            {{ item.modality.name }}
          </td>
        </template>
        <template #[`item.lifeActivity`]="{ item }">
          <td>
            {{ item.lifeActivity.name }}
          </td>
        </template>
      </base-table>
    </v-col>
  </v-row>
</template>
<script>
import BaseTable from '@/components/base/BaseTable.vue';

export default {
    name: 'ObservableInformationsTable',
    components: {
      BaseTable,
    },
    props: {
        observableInformations: {
        type: Array,
        default: () => ([]),
      },
    },
    data() {
        return {
            headersObservableInformations: [
            { text: 'Recording', value: 'recording' },    
            { text: 'File', value: 'file' },
            { text: 'Channel', value: 'channel' },
            { text: 'Modality', value: 'modality' },
            { text: 'Life activity', value: 'lifeActivity' },
            ],
        };
    },
};
</script>