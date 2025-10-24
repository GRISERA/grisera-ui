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
            <v-col
              v-if="timeSeries.link"
              class="col-12 my-auto"
            >
              Currently linked file:
              {{ preparedLink(timeSeries.link) }}
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-icon
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                    @click.stop.prevent="downloadFile(timeSeries)"
                  >
                    mdi-file-find
                  </v-icon>
                </template>
                <span>Click to preview</span>
              </v-tooltip>
            </v-col>
            <v-file-input
              v-model="timeSeries.file"
              label="File input"
              outlined
              prepend-icon="mdi-paperclip"
              @change="onFileChange"
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
              :item-value="e => e.id"
              :items="measures"
              :return-object="true"
              :rules="[
                v => !!v || 'This field is required',
              ]"
              clearable
              item-text="name"
              label="Measure"
              required
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
                v-for="(observableInformation, i) in timeSeries?.observableInformations"
                :key="i"
                class="col-12 bordered-container"
              >
                <v-row>
                  <v-autocomplete
                    v-model="observableInformation.link"
                    :items="filesWithChannels"
                    :return-object="true"
                    :rules="[
                      v => !!v || 'This field is required',
                    ]"
                    clearable
                    item-value="recordingName"
                    label="Recording"
                    required
                  >
                    <template
                      slot="selection"
                      slot-scope="data"
                    >
                      {{ data.item?.link?.name }} (recording name: {{ data.item?.recordingName }})
                    </template>
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      {{ data.item?.link?.name }} (recording name: {{ data.item?.recordingName }})
                    </template>
                  </v-autocomplete>
                  <v-icon
                    v-if="timeSeries?.observableInformations?.length > 1"
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
                    :items="observableInformation.link?.channels"
                    :rules="[
                      v => !!v || 'This field is required',
                    ]"
                    clearable
                    label="Channel"
                    required
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
                    :return-object="true"
                    :rules="[
                      v => !!v || 'This field is required',
                    ]"
                    clearable
                    item-text="name"
                    item-value="id"
                    label="Modality"
                    required
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
                    :return-object="true"
                    :rules="[
                      v => !!v || 'This field is required',
                    ]"
                    clearable
                    item-text="name"
                    item-value="id"
                    label="Live activity"
                    required
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
                color="primary"
                label="Create new time series"
                style="float: right;"
                type="submit"
              >
                {{ isEditMode ? 'Update' : 'Create Time Series' }}
              </v-btn>
            </v-card-actions>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LifeActivitiesAPI from '@/api/LifeActivitiesAPI';
import MeasuresAPI from '@/api/MeasuresAPI';
import ModalitiesAPI from '@/api/ModalitiesAPI';
import RecordingsAPI from '@/api/RecordingsAPI';
import RegisteredDataAPI from '@/api/RegisteredDataAPI';
import TimeSeriesApi from '@/api/TimeSeriesApi';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';

export default {
  name: 'CreateEditTimeSeriesView',
  components: {
    AppBreadcrumbs,
  },
  data() {
    return {
      timeSeries: {
        id: null,
        activityExecutionId: this.$route.params.activityExecution,
        participantId: this.$route.params.id,
        link: '',
        file: undefined,
        type: null,
        spacing: null,
        measure: null,
        observableInformations: [{ ...this.observableInformationPrototype }],
      },
      measures: [],
      modalities: [],
      lifeActivities: [],
      filesWithChannels: [],
      isEditMode: false,
      uploadedFile: undefined,
    };
  },
  watch: {
    '$route.params.timeSeriesId': {
      handler(newValue) {
        if (!newValue) {
          return;
        }
        this.onCreated().then(() => {
          TimeSeriesApi.show(newValue, 4)
            .then(({ data }) => {
              data?.observableInformations.forEach(e => {
                e.link = this.filesWithChannels.find(obj => obj.channels.some(obj2 => obj2.recording_id === e.channel.recording_id));
              });

              this.timeSeries = data;
              this.isEditMode = true;
            });
        });
      },
      immediate: true,
    },
  },
  async created() {
    await this.onCreated();
  },
  methods: {
    onFileChange(file) {
      if (!file) {
        return;
      }

      this.timeSeries.file = file;
    },
    async onCreated() {
      const [modalities, lifeActivities, measures] = await Promise.all([
        ModalitiesAPI.index().then(({ data }) => data),
        LifeActivitiesAPI.index().then(({ data }) => data),
        MeasuresAPI.index().then(({ data }) => data),
      ]);

      this.modalities = modalities;
      this.lifeActivities = lifeActivities;
      this.measures = measures;
      return this.getRecordings();
    },
    create() {
      if (!this.$refs.form.validate()) {
        return;
      }

      TimeSeriesApi[this.isEditMode ? 'update' : 'store']({ ...this.timeSeries }, this.timeSeries.file)
        .then(() => this.$router.go(-1));
    },
    getRecordings() {
      return RecordingsAPI.index().then(({ data }) => {
        let recordingsWithChosenAE = data.filter((recording) => recording.chosenAE.id == this.timeSeries.activityExecutionId);

        recordingsWithChosenAE.forEach((recording) => {
          const fileWithChannels = {
            recordingName: recording.name,
            link: recording.link,
            channels: [],
          };
          recording.data.forEach((channelParticipantPair) => {
            channelParticipantPair.participants.forEach((participant) => {
              if (participant.id == this.timeSeries.participantId) {
                fileWithChannels.channels.push({ ...channelParticipantPair.channel, recording_id: participant.recording_id });
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
    addObservableInformation() {
      this.timeSeries?.observableInformations?.push({ ...this.observableInformationPrototype });
    },
    deleteObservableInformation(info, event) {
      const index = this.timeSeries?.observableInformations?.indexOf(info);
      if (index > -1) {
        this.timeSeries?.observableInformations?.splice(index, 1);
      }
      event.target.blur();
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