<template>
  <v-tab-item>
    <v-container class="container--fluid">
      <v-row>
        <v-col 
          class="col-12 text-right"
          v-if="!isReadOnly"
        >
          <v-row>
            <v-autocomplete
              v-model="chosenScenario"
              class="ma-2"
              :items="scenarios"
              label="Scenarios"
              item-text="name"
              item-value="id"
              :return-object="true"
              outlined
              :rules="validationRules"
              @change="setChosenScenario"
            >
              <template #selection="{ item }">
                {{ item.name }}
              </template>
              <template #item="{ item }">
                {{ item.name }}
              </template>
            </v-autocomplete>
            <v-text-field
              v-model="name"
              class="ma-2"
              label="Name"
              :outlined="true"
              :rules="validationRules"
            />
            <v-btn
              :outlined="true"
              class="ma-4"
              @click="createScenarioExecution()"
            >
              Create
            </v-btn>
          </v-row>
        </v-col>
        <v-col
          v-if="localScenarioExecutions?.length"
          class="col-12 pa-6"
        >
          <scenario-executions-listing-component
            :scenario-executions="localScenarioExecutions"
            @scenario-executions:delete="openDeleteConfirmDialog"
            @activity-execution:edit="editActivityExecution"
            :canPerformActions="!isReadOnly"
          />
        </v-col>
      </v-row>
    </v-container>
    <delete-confirm-dialog
      :active.sync="deleteConfirmDialogActive"
      title="Delete scenario execution"
      @cancel="closeDeleteConfirmDialog"
      @submit="deleteScenario"
    >
      <div class="py-4">
        Are you sure you want to delete the selected item?
      </div>
    </delete-confirm-dialog>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-tab-item>
</template>

<script>
import ExperimentsAPI from '@/api/ExperimentsAPI';
import ScenarioExecutionsAPI from '@/api/ScenarioExecutionsAPI';
import ScenarioExecutionsListingComponent from '@/components/ScenarioExecutionsListingComponent.vue';
import DeleteConfirmDialog from '@/components/dialog/DeleteConfirmDialog.vue';
import AccessRoles from '@/const/AccessRoles';
import { mapGetters } from 'vuex';

export default {
  name: 'ScenarioExecutionTab',
  components: {
    ScenarioExecutionsListingComponent,
    DeleteConfirmDialog,
  },
  props: {
    scenarios: {
      type: Array,
      default: () => [],
    },
    scenarioExecutions: {
      type: Array,
      default: () => [],
    },
    experiment: {
      type: Object,
      default: () => ({}),
    },
    scenario: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      name: undefined,
      chosenScenario: undefined,
      localScenarioExecutions: this.scenarioExecutions,
      deleteConfirmDialogActive: false,
      currentScenario: undefined,
      showValidationErrors: false,
      snackbar: {
        show: false,
        color: '',
        text: '',
        timeout: 3000,
      },
    };
  },
  computed: {
    validationRules() {
      return this.showValidationErrors
          ? [(v) => !!v || 'This field is required']
          : [];
    },
    ...mapGetters({
      getPermission: 'getPermission',
    }),
    isReadOnly() {
      return this.getPermission.role == AccessRoles.READER;
    },
  },
  watch: {
    scenario: {
      handler() {
        this.onCreation();
      },
      deep: true,
    },
  },
  created() {
    this.onCreation();
  },
  methods: {
    showSnackbar(text, color = 'info') {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    validateForm() {
      let isValid = true;
      if (!this.chosenScenario) {
        this.showSnackbar(
            'Please select a scenario before proceeding.',
            'error',
        );
        isValid = false;
      }
      if (!this.name) {
        this.showSnackbar('Please enter a name before proceeding.', 'error');
        isValid = false;
      }
      return isValid;
    },
    onCreation() {
      if (this.scenario != null) {
        this.chosenScenario = this.scenario;
      }
      ExperimentsAPI.show(this.$route.params.id)
          .then(({ data }) => {
            this.localScenarioExecutions = data.scenarioExecutions;
          });
    },
    setChosenScenario(value) {
      this.chosenScenario = value;
    },
    async createScenarioExecution() {
      if (!this.validateForm()) {
        this.showValidationErrors = true;
        return;
      }
      if (typeof this.chosenScenario.activities === 'undefined') {
        return;
      }
      const activities = this.chosenScenario.activities;
      var activityExecutions = [];
      for (const [index, element] of activities.entries()) {
        activityExecutions.push({
          name: `Activity Execution: ${index + 1}`,
          description: 'Activity execution description',
          activity: element,
        });
      }
      ScenarioExecutionsAPI.store(this.chosenScenario.id, {
        name: this.name,
        scenario: this.chosenScenario.name,
        activityExecutions: activityExecutions,
      }).then(() => {
        this.onCreation();
      });
    },
    closeDeleteConfirmDialog() {
      this.deleteConfirmDialogActive = false;
      this.currentScenario = undefined;
    },
    openDeleteConfirmDialog(item) {
      this.deleteConfirmDialogActive = true;
      this.currentScenario = item;
    },
    deleteScenario() {
      ScenarioExecutionsAPI.delete(this.currentScenario.id).then(async () => {
        this.$emit('scenario-execution:delete');
        this.onCreation();
        this.closeDeleteConfirmDialog();
      });
    },
    editActivityExecution(item) {
      this.$router.push({
        name: 'experiment-activity-execution-edit',
        params: {
          experiment: this.experiment.id,
          id: item.id,
        },
      });
    },
  },
};
</script>