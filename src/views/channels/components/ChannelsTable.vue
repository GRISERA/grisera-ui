<template>
  <base-table
    :headers="headers"
    :items="channels"
  />
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import ChannelsAPI from '@/api/ChannelsAPI';

export default {
  name: 'ChannelsTable',
  components: {
    BaseTable,
  },
  data() {
    return {
      headers: [
        { text: 'External ID', value: 'external_id', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
      ],
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
