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
        <a
          :href="item.link"
          target="_blank"
        >{{ item.link }}</a>
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
import BaseTable from '@/components/base/BaseTable.vue';
import TimeSeriesApi from '@/api/TimeSeriesApi';
import ObservableInformationsTable from '@/views/time-series/components/ObservableInformationsTable.vue';

export default {
  name: 'TimeSeriesTable',
  components: {
  BaseTable,
  ObservableInformationsTable,
  ObservableInformationsTable,
  },
  data() {
  return {
    headersTimeSeries: [
      { text: 'Type', value: 'type' },
      { text: 'Spacing', value: 'spacing' },
      { text: 'Measure', value: 'measure' },
      { text: 'Link', value: 'link' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    timeSeries: [],
    activityExecutionId: ~~this.$route.params.activityExecution,
    participantId: ~~this.$route.params.id,
  };
  },
  created() {
    TimeSeriesApi.index()
      .then(({ data }) => {
        this.timeSeries = data.filter((element) => element.activityExecutionId == this.activityExecutionId && element.participantId == this.participantId);
      });
  },
  methods: {
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
          experiment: ~~this.$route.params.experiment,
          activityExecution: this.activityExecutionId,
          id: this.participantId,
          timeSeriesId: timeSeriesId,
        },
      });
    },
  },
};
</script>
