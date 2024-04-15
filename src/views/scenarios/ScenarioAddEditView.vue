<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-12 headline font-weight-bold">
        Create new scenario
      </v-col>
      <v-col class="col-12">
        <v-card>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              @submit.stop.prevent="performAction"
            >
              <v-text-field
                v-model="item.name"
                label="Name"
                :outlined="true"
                :rules="[
                  v => !!v || 'This field is required'
                ]"
              />
              <v-textarea
                v-model="item.description"
                :outlined="true"
                label="Description"
                :rules="[
                  v => !!v || 'This field is required'
                ]"
              />
              <horizontal-text-divider
                text="Activities"
                class="mb-2"
              />
              <v-timeline :dense="true">
                <timeline-activity-item
                  v-for="(activity, index) in item.activities"
                  :key="activity._hash"
                  :activity="activity"
                  :index="index"
                  :is-first="isFirst(index)"
                  :is-last="isLast(index)"
                  :is-movable="!isEditMode"
                  @move:up="moveUp"
                  @move:down="moveDown"
                  @remove="removeExistingActivity"
                />
                <v-timeline-item>
                  <v-btn
                    v-if="!addingNextActivity"
                    :outlined="true"
                    :small="true"
                    @click="addingNextActivity = true"
                  >
                    Add next activity
                  </v-btn>
                  <v-card
                    v-else
                    :elevation="16"
                    style="width: 50%"
                  >
                    <v-card-text>
                      <v-autocomplete
                        v-model="activityToAdd"
                        :items="activities"
                        label="Activity"
                        item-text="name"
                        item-value="id"
                        :return-object="true"
                      >
                        <template #selection="{ item }">
                          {{ item.name }}
                        </template>
                        <template #item="{ item }">
                          {{ item.name }}
                        </template>
                      </v-autocomplete>
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                      <v-btn
                        :text="true"
                        :small="true"
                        @click="removeNextActivity"
                      >
                        Close
                      </v-btn>
                      <v-spacer />
                      <v-btn
                        :small="true"
                        color="primary"
                        @click="addNextActivity"
                      >
                        Add
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
              <v-divider />
              <v-card-actions class="pa-4">
                <v-btn
                  :outlined="true"
                  @click="$router.go(-1)"
                >
                  Cancel
                </v-btn>
                <v-spacer />
                <v-btn
                  color="primary"
                  type="submit"
                >
                  {{ isEditMode ? 'Update' : 'Create' }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ScenariosAPI from '@/api/ScenariosAPI';
import ActivitiesAPI from '@/api/ActivitiesAPI';
import HorizontalTextDivider from '@/components/divider/HorizontalTextDivider.vue';
import TimelineActivityItem from '@/views/scenarios/components/TimelineActivityItem.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import ClassesDescriptions from '@/const/ClassesDescriptions';
import ExperimentsAPI from '@/api/ExperimentsAPI';

export default {
  name: 'ScenarioAddEditView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
    TimelineActivityItem,
    HorizontalTextDivider,
  },
  data() {
    return {
      item: {
        name: undefined,
        description: undefined,
        activities: [],
      },
      experiment: undefined,
      valid: true,
      isEditMode: false,
      activities: [],
      activityToAdd: undefined,
      addingNextActivity: false,
      infoMessage: ClassesDescriptions.EXPERIMENT,
    };
  },
  watch: {
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          return;
        }

        ScenariosAPI.show(~~newValue)
            .then(({ data }) => {
              this.item = data;
              this.isEditMode = true;
            });
      },
      immediate: true,
    },
    '$route.params.experiment': {
      handler(newValue) {
        ExperimentsAPI.show(~~newValue)
            .then(({ data }) => {
              this.experiment = data;
            });
      },
      immediate: true,
    },
  },
  created() {
    ActivitiesAPI.index()
        .then(({ data }) => {
          this.activities = data;
        });
  },
  methods: {
    performAction() {
      if (!this.$refs.form.validate()) {
        return;
      }

      const method = this.isEditMode ? 'update' : 'store';

      ScenariosAPI[method]({ ...this.item, experiment: ~~this.$route.params.experiment })
          .then(() => {
            this.$router.go(-1);
          });
    },
    removeExistingActivity(index) {
      this.item.activities.splice(index, 1);
    },
    removeNextActivity() {
      this.addingNextActivity = false;
      this.activityToAdd = undefined;
    },
    addNextActivity() {
      this.item.activities = this.item.activities || [];
      this.item.activities.push({ ...this.activityToAdd, _hash: new Date().valueOf() });
      this.removeNextActivity();
    },
    isFirst(index) {
      return index === 0;
    },
    isLast(index) {
      return this.item.activities.length === index + 1;
    },
    moveUp(index) {
      const temp = this.item.activities[index];
      this.item.activities[index] = this.item.activities[index - 1];
      this.item.activities[index - 1] = temp;
      this.item.activities = [...this.item.activities];
      this.$forceUpdate();
    },
    moveDown(index) {
      const temp = this.item.activities[index];
      this.item.activities[index] = this.item.activities[index + 1];
      this.item.activities[index + 1] = temp;
      this.item.activities = [...this.item.activities];
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
::v-deep .v-timeline-item__body {
  margin: auto;
}
</style>
