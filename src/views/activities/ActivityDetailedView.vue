<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-12">
        <template>
          <v-card
            :elevation="8"
            class="rounded-xl"
          >
            <v-card-title>
              {{ activity.name }}
            </v-card-title>
            <v-card-text>
              <v-container class="container--fluid">
                <v-row>
                  <v-col class="col-6">
                    <div class="caption">
                      Type
                    </div>
                    <div>
                      <v-chip
                        :color="chipColor"
                        :small="true"
                      >
                        {{ activity.type }}
                      </v-chip>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <div class="caption">
                      Description
                    </div>
                    <div>
                      {{ activity.description }}
                    </div>
                  </v-col>
                </v-row>
                <v-row
                  v-for="param in activity.additionalParameters"
                  :key="param.key"
                >
                  <v-col>
                    <div class="caption">
                      {{ param.name }}
                    </div>
                    <div>
                      {{ param.value }}
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ActivitiesAPI from '@/api/ActivitiesAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import ClassesDescriptions from '@/const/ClassesDescriptions';

export default {
  name: 'ActivityDetailedView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
  },
  data() {
    return {
      activity: '',
      chipColor: undefined,
      infoMessage: ClassesDescriptions.ACTIVITY,
    };
  },
  created() {
    this.getActivity();
  },
  methods: {
    getActivity() {
      ActivitiesAPI.show(this.$route.params.id)
          .then(({ data }) => {
            this.activity = data;
            this.chipColor = this.getActivityTypeChipColor(this.activity.type);
          });
    },
    getActivityTypeChipColor(type) {
      return {
        ['Individual']: 'accent',
        ['Two persons activity']: 'primary',
        ['Group activity']: 'success',
      }[type];
    },
  },
};
</script>
