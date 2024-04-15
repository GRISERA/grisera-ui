<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="text-right">
        <v-btn
          :outlined="true"
          @click="goToTimeSeriesCreation()"
          v-if="!isReadOnly"
        >
          Create
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <time-series-table />
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
import TimeSeriesTable from '@/views/time-series/components/TimeSeriesTable.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import AccessRoles from '@/const/AccessRoles';
import { mapGetters } from 'vuex';

export default {
  name: 'TimeSeriesView',
  components: {
      AppBreadcrumbs,
      TimeSeriesTable,
      InfoToolTipComponent,
  },
  data() {
    return {
      activityExecutionId: '$route.params.activityExecution',
      participantId: '$route.params.participant',
    };
  },
  methods: {
    goToTimeSeriesCreation() {
      const currentRoute = this.$router.currentRoute.path;
      const append = '/create';

      this.$router.push(currentRoute + append);
    },
  },
  computed: {
    ...mapGetters({
      getPermission: 'getPermission',
    }),
    isReadOnly() {
      return this.getPermission.role == AccessRoles.READER;
    },
  },
};
</script>
  