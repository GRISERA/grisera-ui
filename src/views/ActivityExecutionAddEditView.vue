<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-12 headline font-weight-bold">
        {{ getTitleOfForm }}
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
              <v-row>
                <v-autocomplete
                  v-model="item.activity"
                  class="ma-2 pa-2"
                  :items="activities"
                  label="Activity"
                  item-text="name"
                  item-value="id"
                  :return-object="true"
                  :disabled="isEditMode"
                  :rules="[
                    v => !!v || 'This field is required'
                  ]"
                >
                  <template #selection="{ item }">
                    {{ item.name }}
                  </template>
                  <template #item="{ item }">
                    {{ item.name }}
                  </template>
                </v-autocomplete>
              </v-row>
              <horizontal-text-divider
                text="Participants"
                class="mb-2"
              />
              <v-autocomplete
                ref="participantsAutocomplete"
                v-model="item.participants"
                class="ma-2 pa-2"
                :items="participants"
                label="Participants"
                :item-text="item => `${item.name} ${item.surname}`"
                item-value="id"
                :return-object="true"
                :multiple="!isIndividualActivity"
                required
                :rules="[
                  v => !!(Array.isArray(v) && v.length) || !!(!Array.isArray(v) && v) || 'This field is required',
                  v => {
                    if(!isIndividualActivity && item.activity) {
                      if(item.activity.type == 'Two persons activity' && v.length && v.length != 2) {
                        return 'Select exactly two participants';
                      } 
                      else if(item.activity.type == 'Group activity' && v.length && v.length < 2) {
                        return 'Select at least two participants';
                      }
                    }
                    return true;
                  },
                ]"
              >
                <template #selection="{ item }">
                  <v-chip>
                    {{ item.name }} {{ item.surname }}
                  </v-chip>
                </template>
                <template #item="{ item }">
                  {{ item.name }} {{ item.surname }}
                </template>
              </v-autocomplete>
              <horizontal-text-divider
                text="Arrangement models"
                class="mb-2"
              />
              <v-autocomplete
                ref="arrangementAutocomplete"
                v-model="item.arrangement"
                class="ml-2 pl-2"
                :items="arrangementDistanceValues"
                label="Arrangement Distance"
                :item-text="'arrangementDistance'"
                :item-value="'id'"
                :rules="[
                  v => {
                    if(isArrangementsDisabled || v) {
                      return true;
                    }
                    return 'This field is required';
                  },
                ]"
                :disabled="isArrangementsDisabled"
              />
              <horizontal-text-divider
                text="Additional parameters"
                class="mb-2"
              />
              <CustomParametersComponent
                ref="apc"
                :type="'activityExecution'"
              />
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
import ActivityExecutionsAPI from '@/api/ActivityExecutionsAPI';
import ActivitiesAPI from '@/api/ActivitiesAPI';
import ParticipantsAPI from '@/api/ParticipantsAPI';
import HorizontalTextDivider from '@/components/divider/HorizontalTextDivider.vue';
import CustomParametersComponent from '../components/CustomParametersComponent.vue';
import ActivityTypes from '@/const/ActivityTypes';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import ArrangementsAPI from '@/api/ArrangementsAPI';

export default {
  name: 'ActivityExecutionAddEditView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
    HorizontalTextDivider,
    CustomParametersComponent,
  },
  data() {
    return {
      item: {
        name: undefined,
        description: undefined,
        activity: undefined,
        participants: [],
        arrangement: null,
      },
      valid: true,
      isEditMode: false,
      activities: [],
      participants: [],
      arrangementDistanceValues: [],
    };
  },
  computed: {
    isIndividualActivity() {
      return this.item.activity && this.item.activity.type == ActivityTypes.INDIVIDUAL;
    },
    isArrangementsDisabled() {
      return this.item.activity && this.item.activity.type != ActivityTypes.TWO_PERSONS;
    },
    getTitleOfForm() {
      return this.isEditMode ? 'Edit activity execution' : 'Create new activity execution';
    },
  },
  watch: {
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          return;
        }

        ActivityExecutionsAPI.show(newValue)
            .then(({ data }) => {
              this.item = data;
              this.isEditMode = true;
            });
      },
      immediate: true,
    },
    'item.activity': {
      handler(newValue, oldValue) {
        if (!this.isEditMode) {
          if (this.isArrangementsDisabled) {
            this.$refs.arrangementAutocomplete.resetValidation();
          }
          if (!oldValue || (newValue && oldValue.type != newValue.type)) {
            this.$refs.participantsAutocomplete.reset();
            this.item.participants = [];
          }
        }
      },
    },
  },
  created() {
    ActivitiesAPI.index()
        .then(({ data }) => {
          this.activities = data;
        });

    ArrangementsAPI.index().then(({ data }) => {
          this.arrangementDistanceValues = data.filter(e => e.arrangementDistance);
        });
    this.getParticipants();
  },
  methods: {
    performAction() {
      if (!this.$refs.form.validate()) {
        return;
      }

      const method = this.isEditMode ? 'update' : 'store';
      this.setItemParticipantsAsArray();
      ActivityExecutionsAPI[method]({ ...this.item })
          .then(() => {
            this.$router.go(-1);
          });
    },
    getParticipants() {
      ParticipantsAPI.index().then(({ data }) => {
        this.participants = data;
      });
    },
    setItemParticipantsAsArray() {
      if (!Array.isArray(this.item.participants)) {
        this.item.participants = [this.item.participants];
      }
    },
  },
};
</script>

<style scoped>
::v-deep .v-timeline-item__body {
  margin: auto;
}
</style>
  