<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col
        class="headline font-weight-bold my-auto d-flex"
        :cols="12"
      >
        <app-breadcrumbs />
      </v-col>
      <v-col
        v-for="score in scores"
        :key="`score_${ score.title }`"
        class="col-4"
        @click="$router.push(score.url);"
      >
        <dashboard-info-card
          :title="score.title"
          :score="score.score"
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
import DatasetCard from '@/components/DatasetCard.vue';
import DashboardInfoCard from '@/components/DashboardInfoCard.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';

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
    ];
  },
};
</script>
