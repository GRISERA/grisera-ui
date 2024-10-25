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
          @click.prevent.stop="$router.push({ name: 'dataset-creation' })"
        >
          Create
        </v-btn>
      </v-col>
      <v-col class="col-12">
        <v-container class="container--fluid">
          <v-row class="fill-height">
            <v-col
              v-for="dataset in datasets"
              :key="`dataset_${dataset.id}`"
              class="col-4 align-self-stretch"
            >
              <v-card
                :elevation="8"
                height="100%"
                class="d-flex flex-column"
              >
                <v-card-text class="pa-0 flex-grow-1">
                  <v-container class="container--fluid">
                    <v-row class="wrap">
                      <v-col class="col-12">
                        <div class="caption">
                          Name
                        </div>
                        <div class="black--text font-weight-bold">
                          {{ dataset.name }}
                        </div>
                      </v-col>
                      <v-col class="col-6">
                        <div class="caption">
                          Creator
                        </div>
                        <div class="black--text">
                          {{ dataset.creator }}
                        </div>
                      </v-col>
                      <v-col class="col-6">
                        <div class="caption">
                          Date
                        </div>
                        <div class="black--text">
                          {{ dataset.date }}
                        </div>
                      </v-col>
                      <v-col class="col-12">
                        <div class="caption">
                          Rights
                        </div>
                        <div class="black--text">
                          {{ dataset.rights }}
                        </div>
                      </v-col>
                      <v-col class="col-12">
                        <div class="caption">
                          Description
                        </div>
                        <div class="black--text">
                          {{ dataset.description }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-icon
                    color="primary"
                    @click="() => {
                      selectCurrentDataset(dataset);
                      $router.push({
                        name: 'dataset-edit',
                        params: { id: dataset.id}
                      });
                    }"
                    v-if="canEditDataset(dataset.id)"
                  >
                    mdi-pen
                  </v-icon>
                  <v-spacer />
                  <v-btn
                    color="primary"
                    @click="selectCurrentDataset(dataset)"
                  >
                    select and proceed
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import AccessRoles from '@/const/AccessRoles';
import PermissionsService from '@/services/PermissionsService';
import DatasetAPI from '@/api/DatasetAPI';
import { mapMutations, mapState, mapGetters } from 'vuex';

export default {
  name: 'DatasetsView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
  },
  data: () => {
    return {
      permissions: [],
      datasets: [],
    };
  },
  created() {
    DatasetAPI.index().then(({ data }) => {
      this.datasets = data;
    });
    PermissionsService.getUserPermissions(this.getUser().userId).then((response) => {
      this.permissions = response.data;
    });
  },
  methods: {
    ...mapMutations({
      setDataset: 'setDataset',
    }),
    ...mapGetters({
      getUser: 'getUser',
    }),
    selectCurrentDataset(dataset) {
      this.setDataset(dataset);
      this.$router.push({ name: 'main' });
    },
    canEditDataset(datasetId) {
      const permission = this.permissions.find(permission => permission.datasetId == datasetId);
      return permission && permission.role != AccessRoles.READER;
    },
  },
};
</script>
