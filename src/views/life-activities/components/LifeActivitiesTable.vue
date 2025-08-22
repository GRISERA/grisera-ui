<template>
  <div>
    <base-table
      :headers="headers"
      :items="lifeActivities"
    >
      <template #actions="{ item }">
        <v-icon
          class="mr-2"
          color="primary"
          @click.stop.prevent="openEditDialog(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
    </base-table>

    <life-activity-edit-dialog
      v-model="editDialog"
      :life-activity-data="selectedLifeActivity"
      @saved="onLifeActivitySaved"
      @close="editDialog = false"
    />
  </div>
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import LifeActivitiesAPI from '@/api/LifeActivitiesAPI';
import LifeActivityEditDialog from './LifeActivityEditDialog.vue';

export default {
  name: 'LifeActivitiesTable',
  components: {
    BaseTable,
    LifeActivityEditDialog,
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      lifeActivities: [],
      editDialog: false,
      selectedLifeActivity: null,
    };
  },
  created() {
    this.fetchLifeActivities();
  },
  methods: {
    fetchLifeActivities() {
      LifeActivitiesAPI.index()
        .then(({ data }) => {
          this.lifeActivities = data;
        });
    },
    openEditDialog(lifeActivity) {
      this.selectedLifeActivity = { ...lifeActivity };
      this.editDialog = true;
    },
    onLifeActivitySaved(updatedLifeActivity) {
      const index = this.lifeActivities.findIndex(la => la.id === updatedLifeActivity.id);
      if (index !== -1) {
        this.$set(this.lifeActivities, index, updatedLifeActivity);
      }
    },
  },
};
</script>