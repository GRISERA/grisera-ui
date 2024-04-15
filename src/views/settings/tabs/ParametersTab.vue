<template>
  <v-tab-item>
    <v-container v-if="parameters && types">
      <collapse-listing :data="types">
        <template #panel-header="{ item }">
          <slot name="panel-header">
            <h4>{{ transformParameterName(item) }}</h4>
          </slot>
        </template>
        <template #panel-content="{ item }">
          <parameters-table-component
            v-if="parameters"
            :params="parameters"
            :type="item"
          />
        </template>
      </collapse-listing>
    </v-container>
  </v-tab-item>
</template>
<script>
import ParametersAPI from '@/api/ParametersAPI';
import CollapseListing from '@/components/CollapseListing.vue';
import ParametersTableComponent from '@/components/ParametersTableComponent.vue';
import DummyParametersTypes from '@/const/DummyParametersTypes';

export default {
  name: 'ParametersTab',
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
      this.types = DummyParametersTypes;
    },

    transformParameterName(name) {
      return name.replace(/([A-Z])/g, ' $1').toUpperCase();
    },
  },
};
</script>