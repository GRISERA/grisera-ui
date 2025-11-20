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
            <v-form ref="form">
              <v-row>
                <v-col class="col-12 text-right">
                  <v-row>
                    <v-autocomplete
                      v-model="item.chosenScenarioExecution"
                      :items="scenarioExecutions"
                      :return-object="true"
                      :rules="[
                        v => !!v || 'This field is required'
                      ]"
                      class="ma-2"
                      item-text="name"
                      item-value="id"
                      label="Scenario Executions"
                      outlined
                      @change="resetAE"
                    >
                      <template #selection="{ item }">
                        {{ item.name }}
                      </template>
                      <template #item="{ item }">
                        {{ item.name }}
                      </template>
                    </v-autocomplete>

                    <v-autocomplete
                      v-model="item.chosenAE"
                      :items="activityExecutions"
                      :return-object="true"
                      :rules="[
                        v => !!v || 'This field is required'
                      ]"
                      class="ma-2"
                      item-text="name"
                      item-value="id"
                      label="Activity Execution"
                      outlined
                      @change="updateParticipantsList"
                    >
                      <template #selection="{ item }">
                        {{ item.name }}
                      </template>
                      <template #item="{ item }">
                        {{ item.name }}
                      </template>
                    </v-autocomplete>
                  </v-row>
                </v-col>
              </v-row>
              <v-text-field
                v-model="item.name"
                :outlined="true"
                :rules="[
                  v => !!v || 'This field is required'
                ]"
                label="Name"
              />
              <v-textarea
                v-model="item.description"
                :outlined="true"
                :rules="[
                  v => !!v || 'This field is required'
                ]"
                label="Description"
              />
              <v-col
                v-if="item.link"
                class="col-12 my-auto"
              >
                <v-divider class="pt-4" />
                Currently linked file:
                {{ preparedLink(item.link) }}
                <v-tooltip top>
                  <template #activator="{ on, attrs }">
                    <v-icon
                      color="primary"
                      v-bind="attrs"
                      v-on="on"
                      @click.stop.prevent="downloadFile(item)"
                    >
                      mdi-file-find
                    </v-icon>
                  </template>
                  <span>Click to preview</span>
                </v-tooltip>
              </v-col>
              <v-col :flex="5">
                <v-file-input
                  v-model="item.file"
                  label="File input"
                  outlined
                  prepend-icon="mdi-paperclip"
                  @change="onFileChange(item)"
                />
              </v-col>
              <horizontal-text-divider
                class="mb-2"
                text="Channel info"
              />
              <v-col
                v-for="(file, i) in item.data"
                :key="i"
                class="col-12 bordered-container"
              >
                <v-row>
                  <v-autocomplete
                    v-model="file.channel"
                    :item-text="'name'"
                    :items="availableChannels(file.channel)"
                    :return-object="true"
                    :rules="[
                      v => !!v || 'This field is required'
                    ]"
                    class="ma-2 pa-2"
                    label="Channel"
                  />
                  <v-icon
                    v-if="moreThanOne"
                    ref="deleteIcon"
                    class="mr-5 delete-icon"
                    color="error"
                    size="32"
                    @click="deleteItem(file, $event)"
                  >
                    mdi-delete
                  </v-icon>
                </v-row>
                <v-row>
                  <v-autocomplete
                    ref="participantsAutocomplete"
                    v-model="file.participants"
                    :item-text="e => `${ e.name } ${ e.surname }`"
                    :items="participants"
                    :multiple="true"
                    :return-object="true"
                    :rules="[
                      v => !!(Array.isArray(v) && v.length) || !!(!Array.isArray(v) && v) || 'This field is required'
                    ]"
                    class="ma-2 pa-2"
                    item-value="id"
                    label="Participants"
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
                </v-row>
              </v-col>
            </v-form>
            <v-btn
              :outlined="true"
              @click="addAnother"
            >
              Add another
            </v-btn>
          </v-card-text>
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
              @click="performAction"
            >
              {{ isEditMode ? 'Update' : 'Create Recording' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChannelsAPI from '@/api/ChannelsAPI';
import ExperimentsAPI from '@/api/ExperimentsAPI';
import RecordingsAPI from '@/api/RecordingsAPI';
import RegisteredDataAPI from '@/api/RegisteredDataAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import HorizontalTextDivider from '@/components/divider/HorizontalTextDivider.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';

export default {
  name: 'RecordingsAddEditView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
    HorizontalTextDivider,
  },
  data() {
    return {
      experiment: undefined,
      scenarioExecutions: [],
      activityExecutions: [],
      item: {
        chosenAE: undefined,
        chosenScenarioExecution: undefined,
        name: undefined,
        description: undefined,
        data: [],
        link: '',
        file: undefined,
      },
      dataProtoType: {
        channel: undefined,
        participants: [],
      },
      isEditMode: false,
      channels: [],
      participants: [],
    };
  },
  computed: {
    getTitleOfForm() {
      return this.isEditMode ? 'Edit recording' : 'Create new recording';
    },
    moreThanOne() {
      return this.item.data.length > 1;
    },
  },
  watch: {
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          return;
        }
        this.onCreation().then(() => {
          for (const scenarioExecution of this.experiment.scenarioExecutions) {
            for (const activityExecution of scenarioExecution.activityExecutions) {
              const recording = activityExecution.recordings.find(recording => recording.registeredDataId === newValue);
              if (recording) {
                this.item = recording;
                this.item.chosenScenarioExecution = scenarioExecution;
                this.activityExecutions = this.item.chosenScenarioExecution.activityExecutions;
                this.item.chosenAE = activityExecution;
                this.participants = activityExecution.participants;
                this.isEditMode = true;
                break;
              }
            }
            if (this.item.chosenAE) {
              break;
            }
          }
        });
      },
      immediate: true,
    },
  },
  created() {
    this.onCreation();
  },
  methods: {
    onFileChange(file) {
      if (!file || !file.file) {
        return;
      }

      this.item.file = file.file;
    },
    availableChannels(element) {
      let propertiesArray = this.item.data.filter(item => !!item.channel);
      propertiesArray = propertiesArray.map(object => object.channel.id);

      return this.channels.filter(item => !propertiesArray.includes(item.id) || (
        !!element && item.id == element.id
      ));
    },
    onCreation() {
      this.item.data.push(this.createDataPrototype());
      ChannelsAPI.index().then(({ data }) => this.channels = data);

      return ExperimentsAPI.show(this.$route.params.experiment)
        .then(async ({ data }) => {
          this.experiment = data;
          this.scenarioExecutions = this.experiment.scenarioExecutions.reverse();
        });
    },
    deleteItem(file, event) {
      const index = this.item.data.indexOf(file);
      if (index > -1) {
        this.item.data.splice(index, 1);
      }
      event.target.blur();
    },
    createDataPrototype() {
      return { ...this.dataProtoType };
    },
    addAnother() {
      this.item.data.push(this.createDataPrototype());
    },
    updateParticipantsList() {
      if (this.item.chosenAE) {
        this.participants = this.item.chosenAE.participants;
      } else {
        this.participants = [];
      }
      this.item.data.forEach(obj => {
        if (obj.participants) {
          obj.participants = [];
        }
      });
      this.$refs.form.resetValidation();
    },
    resetAE() {
      this.item.chosenAE = undefined;
      if (this.item.chosenScenarioExecution != undefined) {
        this.activityExecutions = this.item.chosenScenarioExecution.activityExecutions;
      }
      this.updateParticipantsList();
    },
    performAction() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const method = this.isEditMode ? 'update' : 'store';

      RecordingsAPI[method](this.item, this.item.file)
        .then(() => this.$router.go(-1));
    },
    async downloadFile(item) {
      const response = await RegisteredDataAPI.getPreviewUrl(item.link);
      window.open(response.data.preview_url, '_blank');
    },
    preparedLink(link) {
      return link.split('/').pop();
    },
  },
};
</script>

<style scoped>
::v-deep .v-timeline-item__body {
  margin: auto;
}

.bordered-container {
  border: 1px solid #ccc;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
}

.delete-icon {
  height: 100%;
  transform: translateY(+75%);
}
</style>
