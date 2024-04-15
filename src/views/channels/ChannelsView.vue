<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-12">
        <channels-table />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChannelsTable from '@/views/channels/components/ChannelsTable.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';

export default {
  name: 'ChannelsView',
  components: {
    AppBreadcrumbs,
    ChannelsTable,
    InfoToolTipComponent,
  },
};
</script>
