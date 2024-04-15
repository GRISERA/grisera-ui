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
          v-if="scenarioExecutions?.length"
          class="col-12 pa-6"
        >
          <scenario-executions-listing-component
            :scenario-executions="scenarioExecutions"
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
import ActivityExecutionsAPI from '@/api/ActivityExecutionsAPI';
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
      scenarioExecutions: undefined,
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
      ScenarioExecutionsAPI.index().then(({ data }) => {
        this.scenarioExecutions = data;
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
      ScenarioExecutionsAPI.store({
        name: this.name,
        scenario: this.chosenScenario.name,
        experiment: this.experiment.id,
      }).then(() => {
        ScenarioExecutionsAPI.index().then(async ({ data }) => {
          var currentScenarioExecution = data[data.length - 1];
          var activityExecutions = [];
          const activities = this.chosenScenario.activities;
          for (const [index, element] of activities.entries()) {
            var objectToStore = {
              name: `Activity Execution: ${index + 1}`,
              description: 'Activity execution description',
              activity: element,
              activityExecution: null,
              participants: [],
            };
            await ActivityExecutionsAPI.store(objectToStore).then(() => {
              ActivityExecutionsAPI.index().then(({ data }) => {
                activityExecutions.push(data[data.length - 1]);
              });
            });
          }

          await ScenarioExecutionsAPI.update({
            ...currentScenarioExecution,
            activityExecutions: activityExecutions,
          }).then(() => {
            ScenarioExecutionsAPI.index().then(async ({ data }) => {
              this.scenarioExecutions = data;
              var activityExecutions = data[data.length - 1].activityExecutions;
              for (let i = 0; i < activityExecutions.length - 1; i++) {
                activityExecutions[i].activityExecution =
                    activityExecutions[i + 1].id;
                await ActivityExecutionsAPI.update(activityExecutions[i]);
              }
              this.name = undefined;
              this.chosenScenario = undefined;
              this.showValidationErrors = false;
            });
          });
        });
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