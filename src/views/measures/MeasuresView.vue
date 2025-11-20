<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col
        v-if="!isReadOnly"
        class="text-right"
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
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import AccessRoles from '@/const/AccessRoles';
import MeasuresTable from '@/views/measures/components/MeasuresTable.vue';
import { mapGetters } from 'vuex';

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
      return this.getPermission?.role === AccessRoles.READER;
    },
  },
};
</script>
