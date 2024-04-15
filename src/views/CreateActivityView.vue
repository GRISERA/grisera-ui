<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col class="col-12">
        <v-form
          ref="form"
          @submit.stop.prevent="validate()"
        >
          <v-container>
            <v-text-field
              v-model="name"
              :rules="nameRules"
              label="Name"
              outlined
              required
            />
            <v-textarea
              v-model="description"
              label="Description"
              outlined
              no-resize
              rows="3"
            />
            <v-select
              v-model="type"
              :items="typeList"
              label="Type"
              outlined
              :rules="typeRules"
              required
            />
            <CustomParametersComponent
              ref="apc"
              :type="'activity'"
            />
            <v-btn
              :outlined="true"
              @click="$router.go(-1)"
            >
              Cancel
            </v-btn>
            <v-btn
              style="float: right;"
              color="primary"
              label="Create new activity"
              type="submit"
            >
              Create new activity
            </v-btn>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomParametersComponent from '../components/CustomParametersComponent.vue';
import ActivitiesAPI from '@/api/ActivitiesAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';

export default {
  name: 'CreateActivityView',
  components: {
    InfoToolTipComponent, AppBreadcrumbs,
    CustomParametersComponent,
  },
  data: () => {
    return {
      name: '',
      description: '',
      type: '',
      typeList: ['Individual', 'Two persons activity', 'Group activity'],
      nameRules: [
        n => !!n || 'Name is required',
      ],
      typeRules: [
        t => !!t || 'Type is required',
      ],
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        const newActivity = {
          name: this.name,
          description: this.description,
          type: this.type,
          additionalParameters: [],
        };
        this.$refs.apc.parameters?.forEach(param => {
          if (param.selected) {
            newActivity.additionalParameters.push({
              key: param.properties.key,
              name: param.properties.name,
              value: param.value,
            });
            this.$refs.apc.updateParameter(param);
          }
        });
        ActivitiesAPI.store(newActivity).then(() => {
          this.$router.push('/activities');
        });
      }
    },
  },
};
</script>
