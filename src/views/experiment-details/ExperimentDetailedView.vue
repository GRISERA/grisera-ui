<template>
  <v-container class="container--fluid mt-4">
    <v-row v-if="experiment">
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs :items="{ experiment }" />
      </v-col>
      <v-col class="col-12">
        <v-tabs
          v-model="tab"
          background-color="primary"
          class="rounded-xl"
          color="primary"
          dark
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
              :experiment="experiment"
              :active="tab === 1"
              @participant:added="getExperiment"
            />
            <scenarios-tab
              :experiment="experiment"
              :scenarios="experiment.scenarios"
              @scenario:delete="getExperiment"
            />
            <scenario-execution-tab
              :experiment="experiment"
              :scenario-executions="experiment.scenarioExecutions"
              :scenarios="experiment.scenarios"
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
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import OverviewTab from '@/views/experiment-details/tabs/OverviewTab.vue';
import ParticipantsTab from '@/views/experiment-details/tabs/ParticipantsTab.vue';
import RecordingsTab from '@/views/experiment-details/tabs/RecordingsTab.vue';
import ScenarioExecutionTab from '@/views/experiment-details/tabs/ScenarioExecutionTab.vue';
import ScenariosTab from '@/views/experiment-details/tabs/ScenariosTab.vue';

export default {
  name: 'ExperimentDetailedView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
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