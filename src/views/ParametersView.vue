<template>
  <v-container v-if="types">
    <collapse-listing :data="types">
      <template #listing-title>
        <slot name="activities-title">
          <v-row justify="space-between">
            <h1>Parameters</h1>
          </v-row>
        </slot>
      </template>
      <template #panel-header="{ item }">
        <slot name="panel-header">
          <h4>{{ transformParameterName(item.name) }}</h4>
        </slot>
      </template>
      <template #panel-content="{ item }">
        <parameters-table-component
          :params="parameters"
          :type="item.name"
        />
      </template>
    </collapse-listing>
  </v-container>
</template>
<script>
import CollapseListing from '@/components/CollapseListing.vue';
import ParametersTableComponent from '@/components/ParametersTableComponent.vue';
import DummyParametersTypes from '@/const/DummyParametersTypes';
import ParametersAPI from '@/api/ParametersAPI';

export default {
  name: 'ParametersView',
  components: {
    CollapseListing,
    ParametersTableComponent,
  },
  data: () => {
    return {
      parameters: undefined,
      types: undefined,
    };
  },
  created() {
    this.getParameters();
    this.getParametersTypes();
  },
  methods: {
    getParameters() {
      ParametersAPI.index().then(({ data }) => {
        this.parameters = data;
      });
    },

    getParametersTypes() {
      this.types = Object.values(DummyParametersTypes).map(e => ({ name: e }));
    },

    transformParameterName(name) {
      return name.replace(/([A-Z])/g, ' $1').toUpperCase();
    },
  },
};
</script>