<template>
  <v-container style="padding-top: 0; padding-left: 0; padding-right: 0;">
    <div
      v-for="param in parameters"
      :key="param.properties.id"
      class="d-flex"
    >
      <v-checkbox
        v-model="param.selected"
      />
      <v-combobox
        v-model="param.value"
        :label="param.properties.name"
        :items="param.properties.options"
        :disabled="!param.selected"
        outlined
        @input.native="param.value = $event.target.value;"
      />
    </div>
  </v-container>
</template>

<script>
import ParametersAPI from '../api/ParametersAPI';
import DatasetAPI from '@/api/DatasetAPI';

export default {
  name: 'CustomParametersComponent',
  props: {
    type: {
      type: String,
      default: '',
    },
    dataset: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => {
    return {
      parameters: [],
    };
  },
  created() {
    this.getParameters();
  },
  methods: {
    updateParameter(param) {
      if (!param.properties.options.find(option => option == param.value)) {
        param.properties.options.push(param.value);
        ParametersAPI.update(param.properties);
      }
    },
    getParameters() {
      DatasetAPI.show(this.dataset.id)
          .then(({ data }) => {
            this.parameters = data.parameters?.filter(param => param.type == this.type)
                .map(param => {
                  return { properties: param, value: '', selected: true };
                });
          });
    },
  },
};
</script>