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
          @click.prevent.stop="$router.push({ name: 'measure-creation' })"
        >
          Create
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <measures-table :can-perform-actions="!isReadOnly" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MeasuresTable from '@/views/measures/components/MeasuresTable.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import { mapGetters } from 'vuex';
import AccessRoles from '@/const/AccessRoles';

export default {
  name: 'MeasuresView',
  components: {
    AppBreadcrumbs,
    MeasuresTable,
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
