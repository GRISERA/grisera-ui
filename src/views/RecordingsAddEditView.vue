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
                      class="ma-2"
                      :items="scenarioExecutions"
                      label="Scenario Executions"
                      item-text="name"
                      item-value="id"
                      :return-object="true"
                      outlined
                      :rules="[
                        v => !!v || 'This field is required'
                      ]"
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
                      class="ma-2"
                      :items="activityExecutions"
                      label="Activity Execution"
                      item-text="name"
                      item-value="id"
                      :return-object="true"
                      outlined
                      :rules="[
                        v => !!v || 'This field is required'
                      ]"
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
              <v-col :flex="5">
                <v-file-input
                  v-model="item.file"
                  label="File input"
                  prepend-icon="mdi-paperclip"
                  outlined
                  @change="onFileChange(item)"
                />
              </v-col>
              <horizontal-text-divider
                text="Channel info"
                class="mb-2"
              />
              <v-col
                v-for="(file, i) in item.data"
                :key="i"
                class="col-12 bordered-container"
              >
                <v-row>
                  <v-autocomplete
                    v-model="file.channel"
                    class="ma-2 pa-2"
                    :items="availableChannels(file.channel)"
                    label="Channel"
                    :item-text="'name'"
                    :rules="[
                      v => !!v || 'This field is required'
                    ]"
                    :return-object="true"
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
                    class="ma-2 pa-2"
                    label="Participants"
                    :items="participants"
                    :item-text="item => '${item.name} ${item.surname}'"
                    item-value="id"
                    :return-object="true"
                    :multiple="true"
                    :rules="[
                      v => !!(Array.isArray(v) && v.length) || !!(!Array.isArray(v) && v) || 'This field is required'
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
              {{ isEditMode ? 'Update' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="fileSnackbar"
      color="error"
      timeout="3000"
      bottom
    >
      <v-row
        align="center"
        justify="center"
      >
        You need to pick a file.
        <v-btn
          text
          small
          @click="fileSnackbar = false"
        >
          Close
        </v-btn>
      </v-row>
    </v-snackbar>
  </v-container>
</template>

<script>
import ExperimentsAPI from '@/api/ExperimentsAPI';
import ChannelsAPI from '@/api/ChannelsAPI';
import RecordingsAPI from '@/api/RecordingsAPI';
import HorizontalTextDivider from '@/components/divider/HorizontalTextDivider.vue';
import IndexedDB from '@/storage/IndexedDB';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
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
      fileWasUpdated: false,
      item: {
        chosenAE: undefined,
        chosenScenarioExecution: undefined,
        name: undefined,
        description: undefined,
        data: [],
        file: undefined,
      },
      dataProtoType: {
        channel: undefined,
        participants: [],
      },
      isEditMode: false,
      channels: [],
      fileSnackbar: false,
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
        RecordingsAPI.show(newValue)
            .then(({ data }) => {
              this.item = data;
              this.isEditMode = true;
            });
      },
      immediate: true,
    },
  },
  created() {
    ExperimentsAPI.show(this.$route.params.experiment)
        .then(async ({ data }) => {
          this.experiment = data;
          this.scenarioExecutions = this.experiment.scenarioExecutions.reverse();
          if (this.item.chosenScenarioExecution)
            this.activityExecutions = this.item.chosenScenarioExecution.activityExecutions;
          if (this.item.chosenAE)
            this.participants = this.item.chosenAE.participants;
          if (this.item.id) {
            this.item.file = await this.loadFile(0, this.item);
            this.onFileChange(this.item);
            this.resetFileUpdatedToFalse();
            this.$forceUpdate();
          }
        });
    this.item.data.push(this.createDataPrototype());
    ChannelsAPI.index()
        .then(({ data }) => {
          this.channels = data;
        });
  },
  methods: {
    availableChannels(element) {
      let propertiesArray = this.item.data.filter(item => !!item.channel);
      propertiesArray = propertiesArray.map(object => object.channel.id);
      let res = this.channels.filter(item => !propertiesArray.includes(item.id) || (!!element && item.id == element.id));
      return res;
    },
    async loadFileFromIndexedDB(key) {
      const fileData = await IndexedDB.readFileFromIndexedDB(key);
      if (fileData) {
        return fileData;
      } else {
        console.log('No file found in IndexedDB.');
      }
    },
    async loadFile(index, allInfo) {
      var id = allInfo.id.toString() + '_';
      var key = id + index.toString();
      return await this.loadFileFromIndexedDB(key);
    },
    onFileChange(file) {
      this.fileWasUpdated = true;
      file.fileSelected = !!file.file;
    },
    resetFileUpdatedToFalse() {
      this.fileWasUpdated = false;
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
        if (obj.participants)
          obj.participants = [];
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
      if (!this.item.file || (this.item.file.fileSelected != null && !this.item.file.fileSelected)) {
        this.fileSnackbar = true;
        return;
      }
      if (!this.$refs.form.validate()) {
        return;
      }
      const method = this.isEditMode ? 'update' : 'store';

      var files = [];
      files.push(this.item.file);
      this.item.file.index = 0;
      delete this.item.file;
      delete this.item.fileSelected;

      RecordingsAPI[method]({ ...this.item, activityExecution: this.item.chosenAE.id })
          .then(() => {
            RecordingsAPI.index().then(({ data }) => {
              var lastRec = data[data.length - 1];
              var id = lastRec.id.toString();
              if (this.fileWasUpdated) {
                files.forEach((element, index) => {
                  var key = id + '_' + index.toString();
                  IndexedDB.saveFileToIndexedDB(element, key);
                });
              }
            });
            this.$router.go(-1);
          });
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
    