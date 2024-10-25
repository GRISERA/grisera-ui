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
import config from '../../../config.js';
import { mapState } from 'vuex';

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
      user: state => state.user,
    }),
    buttonText() {
      return this.editMode ? 'update' : 'create';
    },
    tokenExpiration() {
      return new Date().getTime() + config.sessionDurationMinutes * 60000;
    },
  },
  watch: {
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) return;
        const value = DatasetAPI.show(newValue).then(({ data }) => {
          this.dataset = { ...data };
          this.editMode = true;
        });
      },
      immediate: true,
    },
  },
  methods: {
    validate() {
      if (!this.$refs.form.validate()) {
        return;
      }

      if (this.editMode) {
        DatasetAPI.update(this.dataset).then(() => {
          this.$router.push({ name: 'datasets' });
        });
      } else {
        DatasetAPI.store(this.dataset)
          .then(({ data }) => {
            PermissionsService.add({
              userId: this.user.userId,
              datasetId: data.id,
              role: Roles.OWNER,
            }).then(({ data }) => {
              localStorage.setItem('token', data.token);
              localStorage.setItem('tokenExpiration', this.tokenExpiration);
              this.$router.push('/datasets');
            });
          });
      }

    },
  },
};
</script>
