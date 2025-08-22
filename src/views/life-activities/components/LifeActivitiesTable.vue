<template>
  <div>
    <base-table
      :headers="headers"
      :items="lifeActivities"
    >
      <template
        v-if="aclCan(aclName.LIFE_ACTIVITY.EDIT)"
        #actions="{ item }"
      >
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
      @close="editDialog = false"
      @saved="onLifeActivitySaved"
    />
  </div>
</template>

<script>
import LifeActivitiesAPI from '@/api/LifeActivitiesAPI';
import BaseTable from '@/components/base/BaseTable.vue';
import aclMixin from '@/mixins/acl-mixin';
import LifeActivityEditDialog from './LifeActivityEditDialog.vue';

export default {
  name: 'LifeActivitiesTable',
  components: {
    BaseTable,
    LifeActivityEditDialog,
  },
  mixins: [
    aclMixin,
  ],
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