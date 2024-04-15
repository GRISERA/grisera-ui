<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-12">
        <life-activities-table />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LifeActivitiesTable from '@/views/life-activities/components/LifeActivitiesTable.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';

export default {
  name: 'LifeActivitiesView',
  components: {
    AppBreadcrumbs,
    LifeActivitiesTable,
    InfoToolTipComponent,
  },
};
</script>
