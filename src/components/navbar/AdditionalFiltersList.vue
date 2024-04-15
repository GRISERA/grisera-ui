<template>
  <v-col
    class="col-auto"
    style="overflow-y: scroll; height: 70vh"
  >
    <v-container
      class="container--fluid"
    >
      <v-row class="row-wrap">
        <v-col class="px-0 mx-1">
          <div>AVAILABLE FILTERS</div>
        </v-col>
      </v-row>
    </v-container>
    <horizontal-divider />
    <div
      v-for="filter in availableFilters"
      :key="`filter_${ filter.name }`"
      style="cursor: pointer"
      class="pt-4 pb-2"
      @click="$emit('select:filter', filter.type)"
    >
      {{ filter.name }}
    </div>
  </v-col>
</template>

<script>
import HorizontalDivider from '@/components/divider/HorizontalDivider.vue';

export default {
  name: 'AdditionalFiltersList',
  components: {
    HorizontalDivider,
  },
  props: {
    availableFilters: {
      type: Array,
      default: () => ([]),
    },
  },
};
</script>
