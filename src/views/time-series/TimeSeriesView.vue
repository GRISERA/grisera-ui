<template>
  <v-container class="container--fluid mt-4">
    <loading-overlay
      :visible="isLoading"
      description="Please wait while we fetch your data..."
      title="Loading Time Series"
    />
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="text-right">
        <create-button
          v-if="!isReadOnly"
          text="Create New Time Series"
          @click="goToTimeSeriesCreation()"
        />
      </v-col>
      <v-col class="col-12">
        <time-series-table @loading="handleLoading" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import AccessRoles from '@/const/AccessRoles';
import TimeSeriesTable from '@/views/time-series/components/TimeSeriesTable.vue';
import CreateButton from '@/components/CreateButton.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'TimeSeriesView',
  components: {
    AppBreadcrumbs,
    TimeSeriesTable,
    InfoToolTipComponent,
    LoadingOverlay,
    CreateButton,
  },
  data() {
    return {
      activityExecutionId: '$route.params.activityExecution',
      participantId: '$route.params.participant',
      isLoading: false,
    };
  },
  methods: {
    goToTimeSeriesCreation() {
      const currentRoute = this.$router.currentRoute.path;
      const append = '/create';

      this.$router.push(currentRoute + append);
    },
    handleLoading(loading) {
      this.isLoading = loading;
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
  