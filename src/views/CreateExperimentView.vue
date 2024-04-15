<template>
  <v-container class="container--fluid mt-4">
    <v-row>
      <v-col class="headline font-weight-bold my-auto d-flex">
        <info-tool-tip-component :info-message="$route.meta.infoMessage" />
        <app-breadcrumbs />
      </v-col>
      <v-col :cols="12">
        <v-form
          ref="form"
          @submit.stop.prevent="validate()"
        >
          <v-container>
            <v-text-field
              v-model="experiment.name"
              :rules="experimentNameRules"
              label="Name"
              outlined
              required
            />
            <v-text-field
              v-model="experiment.creator"
              :rules="authorRules"
              label="Author"
              outlined
              required
            />
            <v-textarea
              v-model="experiment.description"
              label="Description"
              outlined
              no-resize
              rows="3"
            />
            <v-textarea
              v-model="experiment.footnote"
              label="Footnote"
              outlined
              no-resize
              rows="3"
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
              type="submit"
            >
              Create new experiment
            </v-btn>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ExperimentsAPI from '@/api/ExperimentsAPI';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import InfoToolTipComponent from '@/components/InfoToolTipComponent.vue';
import { format } from 'date-fns';

export default {
  name: 'CreateExperimentView',
  components: {
    InfoToolTipComponent,
    AppBreadcrumbs,
  },
  data: () => {
    return {
      experiment: {
        name: undefined,
        description: undefined,
        creator: undefined,
        footnote: undefined,
      },
      experimentNameRules: [
        n => !!n || 'Experiment name is required',
      ],
      authorRules: [
        a => !!a || 'Author is required',
      ],
    };
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        ExperimentsAPI.store({
          ...this.experiment,
          created_at: format(new Date(), 'yyyy-MM-dd'),
        })
            .then(() => {
              this.$router.push('/experiments');
            });
      }
    },
  },
};
</script>
