<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex col-12">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-6 mx-auto">
        <v-form ref="form">
          <v-text-field
            v-model="dataset.name"
            :rules="[ v => requiredRule(v)]"
            label="Name"
            outlined
            required
          />
          <v-text-field
            v-model="dataset.creator"
            :rules="[ v => requiredRule(v)]"
            label="Creator"
            outlined
            required
          />
          <v-text-field
            v-model="dataset.rights"
            label="Rights"
            outlined
            :rules="[ v => requiredRule(v)]"
            required
          />
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="dataset.date"
            persistent
            width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="dataset.date"
                :rules="[ v => requiredRule(v)]"
                label="Date"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                required
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="dataset.date"
              scrollable
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="modal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialog.save(dataset.date)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
          <v-textarea
            v-model="dataset.description"
            label="Description"
            outlined
            no-resize
          />
          <v-btn
            :outlined="true"
            @click="$router.back()"
          >
            Cancel
          </v-btn>
          <v-btn
            style="float: right;"
            color="primary"
            @click="validate"
          >
            {{ buttonText }}
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DatasetAPI from '@/api/DatasetAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import { mapMutations, mapState } from 'vuex';
import DummyChannels from '@/const/DummyChannels';
import DummyLifeActivities from '@/const/DummyLifeActivities';
import DummyModalities from '@/const/DummyModalities';
import LS from '@/storage/LS';
import PermissionsService from '@/services/PermissionsService';
import Roles from '@/const/AccessRoles';

export default {
  name: 'DatasetDetailedView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
  },
  data: () => {
    return {
      dataset: {
        name: undefined,
        creator: undefined,
        rights: undefined,
        date: undefined,
        description: undefined,
      },
      requiredRule: v => !!v || 'This field is required',
      modal: false,
      editMode: false,
    };
  },
  computed: {
    ...mapState({
      data: state => state.data,
      datasets: state => state.datasets,
      user: state => state.user,
    }),
    buttonText() {
      return this.editMode ? 'update' : 'create';
    },
  },
  watch: {
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) return;
        const value = this.datasets.find(e => e.id === ~~newValue);

        if (value) {
          this.dataset = { ...value };
          this.editMode = true;
        }
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations({
      setDatasets: 'setDatasets',
      setData: 'setData',
    }),
    validate() {
      if (!this.$refs.form.validate()) {
        return;
      }

      if (this.editMode) {
        const element = this.datasets.find(e => e.id === this.dataset.id);
        const index = this.datasets.indexOf(element);
        const newDatasets = [...this.datasets];
        newDatasets[index] = this.dataset;
        this.setDatasets(newDatasets);
        this.$router.push({ name: 'datasets' });
      } else {
        DatasetAPI.store(this.dataset)
            .then(async () => {
              const { data } = await DatasetAPI.index();
              this.setDatasets([...data]);
              const newDataset = data[data.length - 1];
              const newData = {
                ...this.data, [newDataset.id]: {
                  channels: DummyChannels,
                  lifeActivities: DummyLifeActivities,
                  modalities: DummyModalities,
                },
              };
              this.setData({ ...newData });
              LS.setJSON('pards', { ...newData });
              PermissionsService.add({
                userId: this.user.userId,
                datasetId: newDataset.id,
                role: Roles.OWNER,
              })
              .then(async () => {
                await this.$router.push({ name: 'datasets' });
              });
            });
      }
    },
  },
};
</script>
