<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col
        :cols="12"
        class="headline font-weight-bold my-auto d-flex"
      >
        <app-breadcrumbs />
      </v-col>
      <v-col
        v-for="score in scores"
        :key="`score_${ score.title }`"
        class="col-3"
        @click="$router.push(score.url);"
      >
        <dashboard-info-card
          :score="score.score"
          :title="score.title"
        />
      </v-col>
      <v-col class="col-12">
        <dataset-card
          :has-title="true"
          title="You are currently working on the following dataset:"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ActivitiesAPI from '@/api/ActivitiesAPI';
import ExperimentsAPI from '@/api/ExperimentsAPI';
import ParticipantsAPI from '@/api/ParticipantsAPI';
import TimeSeriesAPI from '@/api/TimeSeriesApi';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import DashboardInfoCard from '@/components/DashboardInfoCard.vue';
import DatasetCard from '@/components/DatasetCard.vue';

export default {
  name: 'MainView',
  components: {
    AppBreadcrumbs,
    DashboardInfoCard,
    DatasetCard,
  },
  data() {
    return {
      breadcrumbs: [],
      scores: [],
    };
  },
  async created() {
    this.scores = [
      {
        title: 'Total experiments',
        url: '/experiments',
        score: await ExperimentsAPI.count(),
      },
      {
        title: 'Total activities',
        url: '/activities',
        score: await ActivitiesAPI.count(),
      },
      {
        title: 'Total participants',
        url: '/participants',
        score: await ParticipantsAPI.count(),
      },
      {
        title: 'Total time series',
        url: '/time-series',
        score: await TimeSeriesAPI.count(),
      },
    ];
  },
};
</script>
