<template>
  <base-table
    :headers="headersTimeSeries"
    :items="timeSeries"
    :show-expand="true"
  >
    <template #expanded-item="{ item }">
      <td :colspan="6">
        <v-container class="container--fluid px-0">
          <v-row>
            <observable-informations-table :observable-informations="item.observableInformations" />
          </v-row>
        </v-container>
      </td>
    </template>
    <template #[`item.spacing`]="{ item }">
      <td>
        <v-chip
          :color="getSpacingChipColor(item.spacing)"
          :small="true"
        >
          {{ item.spacing }}
        </v-chip>
      </td>
    </template>
    <template #[`item.measure`]="{ item }">
      <td v-if="item.measure">
        {{ item.measure.name }}
      </td>
    </template>
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
    <template #actions="{ item }">
      <v-icon
        class="mr-2"
        color="primary"
        @click.stop.prevent="editTimeSeries(item.id)"
      >
        mdi-pen
      </v-icon>
    </template>
  </base-table>
</template>

<script>
import RegisteredDataAPI from '@/api/RegisteredDataAPI';
import TimeSeriesApi from '@/api/TimeSeriesApi';
import BaseTable from '@/components/base/BaseTable.vue';
import ObservableInformationsTable from '@/views/time-series/components/ObservableInformationsTable.vue';

export default {
  name: 'TimeSeriesTable',
  components: {
    BaseTable,
    ObservableInformationsTable,
  },
  data() {
    return {
      headersTimeSeries: [
        { text: 'Type', value: 'type' },
        { text: 'Spacing', value: 'spacing' },
        { text: 'Measure', value: 'measure' },
        { text: 'Linked file', value: 'link' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      timeSeries: [],
      activityExecutionId: this.$route.params.activityExecution,
      participantId: this.$route.params.id,
    };
  },
  created() {
    this.loadTimeSeries();
  },
  methods: {
    loadTimeSeries() {
      this.$emit('loading', true);
      TimeSeriesApi.indexDetailed(this.$route.params.activityExecution, this.$route.params.id)
        .then(({ data }) => {
          this.timeSeries = data;
        })
        .catch(error => {
          console.error('Error loading time series:', error);
          // Optionally show error message to user
        })
        .finally(() => {
          this.$emit('loading', false);
        });
    },
    getSpacingChipColor(type) {
      return {
        ['Irregular']: 'accent',
        ['Regular']: 'success',
      }[type];
    },
    editTimeSeries(timeSeriesId) {
      this.$router.push({
        name: 'experiment-activity-execution-participant-time-series-edit',
        params: {
          experiment: this.$route.params.experiment,
          activityExecution: this.activityExecutionId,
          id: this.participantId,
          timeSeriesId: timeSeriesId,
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
