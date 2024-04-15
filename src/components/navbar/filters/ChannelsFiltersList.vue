<template>
  <navigation-filters-list
    type="channels"
    :items="channels"
    :selected="selected"
    @update:selected="$emit('update:selected', $event)"
    @delete:filter="$emit('delete:filter', $event)"
  />
</template>

<script>
import ChannelsAPI from '@/api/ChannelsAPI';
import NavigationFiltersList from '@/components/navbar/NavigationFiltersList.vue';

export default {
  name: 'ChannelsFiltersList',
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
      channels: [],
    };
  },
  created() {
    ChannelsAPI.index()
        .then(({ data }) => {
          this.channels = data;
        });
  },
};
</script>
