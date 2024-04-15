<template>
  <navigation-filters-list
    type="activities"
    :items="activities"
    :selected="selected"
    @update:selected="$emit('update:selected', $event)"
    @delete:filter="$emit('delete:filter', $event)"
  />
</template>

<script>
import ActivitiesAPI from '@/api/ActivitiesAPI';
import NavigationFiltersList from '@/components/navbar/NavigationFiltersList.vue';

export default {
  name: 'ActivitiesFiltersList',
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
      activities: [],
    };
  },
  created() {
    ActivitiesAPI.index()
        .then(({ data }) => {
          this.activities = data;
        });
  },
};
</script>
