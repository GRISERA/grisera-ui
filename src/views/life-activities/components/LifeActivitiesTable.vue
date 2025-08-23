<template>
  <base-table
    :headers="headers"
    :items="lifeActivities"
  />
</template>

<script>
import LifeActivitiesAPI from '@/api/LifeActivitiesAPI';
import BaseTable from '@/components/base/BaseTable.vue';

export default {
  name: 'LifeActivitiesTable',
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
      lifeActivities: [],
    };
  },
  created() {
    LifeActivitiesAPI.index()
      .then(({ data }) => {
        this.lifeActivities = data;
      });
  },
};
</script>
