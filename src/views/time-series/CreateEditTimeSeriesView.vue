<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-12">
        <v-form
          ref="form"
          @submit.stop.prevent="create"
        >
          <v-container>
            <v-text-field
              v-model="timeSeries.link"
              label="Link"
              outlined
              required
              :rules="[
                l => !!l || 'This field is required',
                l => isValidHttpUrl(l) || 'Link has to be valid',
              ]"
            />
            <v-divider />
            <v-radio-group
              v-model="timeSeries.type"
              mandatory
              row
            >
              <v-radio
                label="Epoch"
                value="Epoch"
              />
              <v-radio
                label="Timestamp"
                value="Timestamp"
              />
            </v-radio-group>
            <v-divider />
            <v-radio-group
              v-model="timeSeries.spacing"
              mandatory
              row
            >
              <v-radio
                label="Irregular"
                value="Irregular"
              />
              <v-radio
                label="Regular"
                value="Regular"
              />
            </v-radio-group>
            <v-divider />
            <v-autocomplete
              v-model="timeSeries.measure"
              :items="measures"
              label="Measure"
              clearable
              required
              :rules="[
                v => !!v || 'This field is required',
              ]"
            >
              <template
                slot="selection"
                slot-scope="data"
              >
                {{ data.item?.name }}
              </template>
              <template
                slot="item"
                slot-scope="data"
              >
                {{ data.item?.name }}
              </template>
            </v-autocomplete>
            <v-divider />
            <v-card-text>
              <v-col
                v-for="(observableInformation, i) in timeSeries.observableInformations"
                :key="i"
                class="col-12 bordered-container"
              >
                <v-row>
                  <v-autocomplete
                    v-model="observableInformation.file"
                    :items="filesWithChannels"
                    label="File"
                    clearable
                    required
                    :rules="[
                      v => !!v || 'This field is required',
                    ]"
                  >
                    <template
                      slot="selection"
                      slot-scope="data"
                    >
                      {{ data.item?.file.name }} (recording name: {{ data.item?.recordingName }})
                    </template>
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      {{ data.item?.file.name }} (recording name: {{ data.item?.recordingName }})
                    </template>
                  </v-autocomplete>
                  <v-icon
                    v-if="timeSeries.observableInformations.length > 1"
                    ref="deleteIcon"
                    class="mr-5 delete-icon"
                    color="error"
                    size="32"
                    @click="deleteObservableInformation(observableInformation, $event)"
                  >
                    mdi-delete
                  </v-icon>
                </v-row>
                <v-row>
                  <v-autocomplete
                    v-model="observableInformation.channel"
                    :items="observableInformation.file?.channels"
                    label="Channel"
                    clearable
                    required
                    :rules="[
                      v => !!v || 'This field is required',
                    ]"
                  >
                    <template
                      slot="selection"
                      slot-scope="data"
                    >
                      {{ data.item?.name }}
                    </template>
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      {{ data.item?.name }}
                    </template>
                  </v-autocomplete>
                </v-row>
                <v-row>
                  <v-autocomplete
                    v-if="modalities.length > 0"
                    v-model="observableInformation.modality"
                    :items="modalities"
                    label="Modality"
                    clearable
                    required
                    :rules="[
                      v => !!v || 'This field is required',
                    ]"
                  >
                    <template
                      slot="selection"
                      slot-scope="data"
                    >
                      {{ data.item?.name }}
                    </template>
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      {{ data.item?.name }}
                    </template>
                  </v-autocomplete>
                </v-row>
                <v-row>
                  <v-autocomplete
                    v-if="lifeActivities.length > 0"
                    v-model="observableInformation.lifeActivity"
                    :items="lifeActivities"
                    label="Live activity"
                    clearable
                    required
                    :rules="[
                      v => !!v || 'This field is required',
                    ]"
                  >
                    <template
                      slot="selection"
                      slot-scope="data"
                    >
                      {{ data.item?.name }}
                    </template>
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      {{ data.item?.name }}
                    </template>
                  </v-autocomplete>
                </v-row>
              </v-col>
              <v-btn
                :outlined="true"
                @click="addObservableInformation"
              >
                Add observable information
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
                style="float: right;"
                color="primary"
                label="Create new time series"
                type="submit"
              >
                {{ isEditMode ? 'Update' : 'Create' }}
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import LifeActivitiesAPI from '@/api/LifeActivitiesAPI';
import MeasuresAPI from '@/api/MeasuresAPI';
import ModalitiesAPI from '@/api/ModalitiesAPI';
import RecordingsAPI from '@/api/RecordingsAPI';
import TimeSeriesApi from '@/api/TimeSeriesApi';
import IndexedDB from '@/storage/IndexedDB';

export default {
  name: 'CreateEditTimeSeriesView',
  components: {
      AppBreadcrumbs,
  },
  data () {
    return {
      timeSeries: {
        activityExecutionId: ~~this.$route.params.activityExecution,
        participantId: ~~this.$route.params.id,
        link: '',
        type: null,
        spacing: null,
        measure: null,
        observableInformations: [ { ... this.observableInformationPrototype }],
      },
      measures: [],
      modalities: [],
      lifeActivities: [],
      filesWithChannels: [],
      isEditMode: false,
    };
  },
  watch: {
    '$route.params.timeSeriesId': {
      handler(newValue) {
        if (!newValue) {
          return;
        }
        TimeSeriesApi.show(~~newValue)
          .then(({ data }) => {
            this.timeSeries = data;
            this.isEditMode = true;
          });
      },
      immediate: true,
    },
  },
  created() {
    this.getRecordings();
    ModalitiesAPI.index()
      .then(({ data }) => {
        this.modalities = data;
      });
    LifeActivitiesAPI.index()
      .then(({ data }) => {
        this.lifeActivities = data;
      });
    MeasuresAPI.index()
      .then(({ data }) => {
        this.measures = data;
      });
  },
  methods: {
    create() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const method = this.isEditMode ? 'update' : 'store';
      TimeSeriesApi[method]({ ...this.timeSeries }).then(() => {
        this.$router.go(-1);
      });
    },
    getRecordings() {
      RecordingsAPI.index().then(({ data }) => {
        let recordingsWithChosenAE = data.filter((recording) => recording.chosenAE.id == this.timeSeries.activityExecutionId);
        recordingsWithChosenAE.forEach(async (recording) => {
          const fileWithChannels = {
            recordingName: recording.name,
            file: await this.getFile(recording),
            channels: [],
          };
          recording.data.forEach((channelParticipantPair) => {
            channelParticipantPair.participants.forEach((participant) => {
              if (participant.id == this.timeSeries.participantId) {
                fileWithChannels.channels.push(channelParticipantPair.channel);
              }
            });
          });
          if (fileWithChannels.channels.length > 0) {
            if (this.filesWithChannels.length == 0) {
              this.filesWithChannels = [fileWithChannels];
            } else {
              this.filesWithChannels.push(fileWithChannels);
            }
          }
        });
      });
    },
    async loadFileFromIndexedDB(key) {
      const fileData = await IndexedDB.readFileFromIndexedDB(key);
      if (fileData) {
        return fileData;
      } else {
        console.log('No file found in IndexedDB.');
      }
    },
    async getFile(recording) {
      var id = recording.id.toString() + '_';
      var key = id + '0';
      var fileLoaded = await this.loadFileFromIndexedDB(key);
      return fileLoaded;
    },
    addObservableInformation() {
      this.timeSeries.observableInformations.push({ ... this.observableInformationPrototype });
    },
    deleteObservableInformation(info, event) {
      const index = this.timeSeries.observableInformations.indexOf(info);
      if (index > -1) {
        this.timeSeries.observableInformations.splice(index, 1);
      }
      event.target.blur();
    },
    isValidHttpUrl(urlToCheck) {
      let url;
      try {
        url = new URL(urlToCheck);
      } catch (_) {
        return false;  
      }
      return url.protocol === 'http:' || url.protocol === 'https:';
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