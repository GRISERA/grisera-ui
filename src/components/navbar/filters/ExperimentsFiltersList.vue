<template>
  <navigation-filters-list
    type="experiments"
    :items="experiments"
    :selected="selected"
    @update:selected="$emit('update:selected', $event)"
    @delete:filter="$emit('delete:filter', $event)"
  />
</template>

<script>
import ExperimentsAPI from '@/api/ExperimentsAPI';
import NavigationFiltersList from '@/components/navbar/NavigationFiltersList.vue';

export default {
  name: 'ExperimentsFiltersList',
  components: {
    NavigationFiltersList,
  },
  props: {
    selected: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
      experiments: [],
    };
  },
  created() {
    ExperimentsAPI.index()
        .then(({ data }) => {
          this.experiments = data;
        });
  },
};
</script>
