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
        { text: 'ID', value: 'id', sortable: false, width: '5%' },
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
