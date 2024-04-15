<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <app-breadcrumbs />
      </v-col>
      <v-col class="text-right">
        <v-btn
          :outlined="true"
          @click.prevent.stop="resetStorage"
        >
          Reset storage
        </v-btn>
      </v-col>
    </v-row>
    <v-col class="col-12">
      <v-tabs
        v-model="tab"
        class="rounded-xl"
        color="primary"
        dark
        background-color="primary"
        grow
      >
        <v-tab
          v-for="taba in tabs"
          :key="taba.id"
          ripple
        >
          {{ taba.name }}
        </v-tab>
        <v-tabs-items v-model="tab">
          <parameters-tab />
          <access-permissions-tab />
        </v-tabs-items>
      </v-tabs>
    </v-col>
  </v-container>
</template>

<script>
import LocalStorageService from '@/storage/LocalStorageService';
import ParametersTab from '@/views/settings/tabs/ParametersTab';
import AccessPermissionsTab from '@/views/settings/tabs/AccessPermissionsTab.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';

export default {
  name: 'SettingsView',
  components: {
    AppBreadcrumbs,
    ParametersTab,
    AccessPermissionsTab,
  },
  data() {
    return {
      tab: 0,
      tabs: [
        { id: 1, name: 'Parameters' },
        { id: 2, name: 'Access permissions' },
      ],
    };
  },
  methods: {
    resetStorage() {
      LocalStorageService.clear();
      LocalStorageService.init();
    },
  },
};
</script>
