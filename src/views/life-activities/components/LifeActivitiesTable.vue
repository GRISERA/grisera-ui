<template>
  <base-table
    :headers="headers"
    :items="lifeActivities"
  />
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import LifeActivitiesAPI from '@/api/LifeActivitiesAPI';

export default {
  name: 'LifeActivitiesTable',
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
