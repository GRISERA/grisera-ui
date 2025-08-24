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
        @click="score.url ? $router.push(score.url) : () => undefined"
      >
        <dashboard-info-card
          :loading="score.loading"
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
      scores: [
        { title: 'Total experiments', url: '/experiments', loading: true },
        { title: 'Total activities', url: '/activities', loading: true },
        { title: 'Total participants', url: '/participants', loading: true },
        { title: 'Total time series', loading: true },
      ],
    };
  },
  async created() {
    try {
      const updatedScores = await Promise.all([
        { title: 'Total experiments', url: '/experiments', score: await ExperimentsAPI.count() },
        { title: 'Total activities', url: '/activities', score: await ActivitiesAPI.count() },
        { title: 'Total participants', url: '/participants', score: await ParticipantsAPI.count() },
        { title: 'Total time series', score: await TimeSeriesAPI.count() },
      ]);
      this.scores =
        updatedScores.map(score => (
          { ...score, loading: false }
        ));
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
      this.scores =
        this.scores.map(score => (
          { ...score, loading: false, score: 'Error' }
        ));
    }
  },
};
</script>
