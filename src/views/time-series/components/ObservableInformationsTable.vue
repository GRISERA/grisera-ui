<template>
  <v-row>
    <v-col class="col-12 pa-6">
      <base-table
        :headers="headersObservableInformations"
        :items="observableInformations"
      >
        <template #[`item.recording`]="{ item }">
          <td>
            {{ item?.recording?.name ?? 'N/A' }}
          </td>
        </template>
        <template #[`item.link`]="{ item }">
          <td>
            {{ item?.recording?.link ?? 'N/A' }}
          </td>
        </template>
        <template #[`item.channel`]="{ item }">
          <td>
            {{ item?.channel?.name ?? 'N/A' }}
          </td>
        </template>
        <template #[`item.modality`]="{ item }">
          <td>
            {{ item?.modality?.name ?? 'N/A' }}
          </td>
        </template>
        <template #[`item.lifeActivity`]="{ item }">
          <td>
            {{ item?.lifeActivity?.name ?? 'N/A' }}
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
      default: () => (
        []
      ),
    },
  },
  data() {
    return {
      headersObservableInformations: [
        { text: 'Recording', value: 'recording' },
        { text: 'Link', value: 'link' },
        { text: 'Channel', value: 'channel' },
        { text: 'Modality', value: 'modality' },
        { text: 'Life activity', value: 'lifeActivity' },
      ],
    };
  },
};
</script>