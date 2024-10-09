<template>
  <v-container class="container--fluid mt-4">
    <v-row v-if="experiment">
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
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
            <overview-tab
              :experiment="experiment"
            />            
            <participants-tab
              :participants="experiment.participants"
              :experiment="experiment"
              @participant:added="getExperiment"
            />
            <scenarios-tab
              :scenarios="experiment.scenarios"
              :experiment="experiment"
              @scenario:delete="getExperiment"
            />
            <scenario-execution-tab
              :scenarios="experiment.scenarios"
              :scenarioExecutions="experiment.scenarioExecutions"
              :experiment="experiment"
              @scenario-execution:delete="getExperiment"
            />
            <recordings-tab
              :experiment="experiment"
              @recordings:delete="getExperiment"
            />
            <v-tab-item>
              <v-card flat>
                <v-card-text>TO DO</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ExperimentsAPI from '@/api/ExperimentsAPI';
import ScenariosTab from '@/views/experiment-details/tabs/ScenariosTab.vue';
import OverviewTab from '@/views/experiment-details/tabs/OverviewTab.vue';
import ParticipantsTab from '@/views/experiment-details/tabs/ParticipantsTab.vue';
import ScenarioExecutionTab from '@/views/experiment-details/tabs/ScenarioExecutionTab.vue';
import RecordingsTab from '@/views/experiment-details/tabs/RecordingsTab.vue';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';

export default {
  name: 'ExperimentDetailedView',
  components: {
    InfoToolTipComponent, AppBreadcrumbs,
    ParticipantsTab,
    OverviewTab,
    ScenariosTab,
    ScenarioExecutionTab,
    RecordingsTab,
  },
  data() {
    return {
      tab: 0,
      tabs: [
        { id: 1, name: 'Overview' },
        { id: 2, name: 'Participants' },
        { id: 3, name: 'Scenarios' },
        { id: 4, name: 'Scenarios executions' },
        { id: 5, name: 'Recordings' },
      ],
      experiment: undefined,
    };
  },
  created() {
    this.getExperiment();
  },
  methods: {
    getExperiment() {
      ExperimentsAPI.show(this.$route.params.id)
          .then(({ data }) => {
            this.experiment = data;
          });
    },
  },
};
</script>