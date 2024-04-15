<template>
  <base-table
    :headers="headers"
    :items="modalities"
  />
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import ModalitiesAPI from '@/api/ModalitiesAPI';

export default {
  name: 'ModalitiesTable',
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
      modalities: [],
    };
  },
  created() {
    ModalitiesAPI.index()
        .then(({ data }) => {
          this.modalities = data;
        });
  },
};
</script>
