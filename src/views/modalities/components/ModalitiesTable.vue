<template>
  <base-table
    :headers="headers"
    :items="modalities"
  />
</template>

<script>
import ModalitiesAPI from '@/api/ModalitiesAPI';
import BaseTable from '@/components/base/BaseTable.vue';

export default {
  name: 'ModalitiesTable',
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
