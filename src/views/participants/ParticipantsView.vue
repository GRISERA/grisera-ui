<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col 
        class="text-right"
        v-if="!isReadOnly"  
      >
        <v-btn
          :outlined="true"
          @click.prevent.stop="$router.push({ name: 'participant-creation' })"
        >
          Create
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <participants-table />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ParticipantsTable from '@/views/participants/components/ParticipantsTable.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import { mapGetters } from 'vuex';
import AccessRoles from '@/const/AccessRoles';

export default {
  name: 'ParticipantsView',
  components: {
    AppBreadcrumbs,
    ParticipantsTable,
    InfoToolTipComponent,
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
