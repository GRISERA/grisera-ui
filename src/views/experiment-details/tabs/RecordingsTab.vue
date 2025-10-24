<template>
  <v-tab-item>
    <v-container class="container--fluid">
      <v-row>
        <v-col
          v-if="!isReadOnly"
          class="col-12 text-right"
        >
          <v-row justify="end">
            <create-button
              class="ma-4"
              text="Create New Recording"
              @click="$router.push({ name: 'experiment-recording-add', params: { experiment: experiment.id } })"
            />
          </v-row>
        </v-col>
        <v-col
          v-if="dataToDisplay?.length"
          class="col-12 pa-6"
        >
          <recordings-table
            :can-edit-and-delete="!isReadOnly"
            :data-to-display="dataToDisplay"
            :experiment="experiment"
            @recordings:delete="openDeleteConfirmDialog"
          />
        </v-col>
      </v-row>
    </v-container>
    <delete-confirm-dialog
      :active.sync="deleteConfirmDialogActive"
      title="Delete recording?"
      @cancel="closeDeleteConfirmDialog"
      @submit="deleteRecord"
    >
      <div class="py-4">
        Are you sure you want to delete the selected item?
      </div>
    </delete-confirm-dialog>
  </v-tab-item>
</template>

<script>
import RecordingsAPI from '@/api/RecordingsAPI';
import CreateButton from '@/components/CreateButton.vue';
import DeleteConfirmDialog from '@/components/dialog/DeleteConfirmDialog.vue';
import AccessRoles from '@/const/AccessRoles';
import randomHash from '@/procedures/random-hash';
import { mapGetters } from 'vuex';
import RecordingsTable from './RecordingsTable.vue';

export default {
  name: 'RecordingsTab',
  components: {
    RecordingsTable,
    DeleteConfirmDialog,
    CreateButton,
  },
  props: {
    experiment: {
      type: Object,
      default: () => (
        {}
      ),
    },
  },
  data() {
    return {
      dataToDisplay: undefined,
      deleteConfirmDialogActive: false,
      currentRecording: undefined,
    };
  },
  watch: {
    experiment() {
      this.onCreation();
    },
  },
  created() {
    this.onCreation();
  },
  methods: {
    onCreation() {
      const filteredData = [];
      if (this.experiment.scenarioExecutions) {
        this.experiment.scenarioExecutions.forEach(obj => {
          obj.activityExecutions.forEach(obj2 => {
            if (obj2.recordings) {
              obj2.recordings.forEach(obj3 => {
                filteredData.push({
                  ...obj3,
                  id: obj3.id?.[0] || randomHash(),
                  activityExecution: obj2,
                  scenarioExecution: obj,
                  scenarioExecution_name: obj.name, activityExecution_name: obj2.name,
                });
              });
            }
          });
        });
      }
      this.dataToDisplay = filteredData;
    },
    closeDeleteConfirmDialog() {
      this.deleteConfirmDialogActive = false;
      this.currentRecording = undefined;
    },
    openDeleteConfirmDialog(item) {
      this.deleteConfirmDialogActive = true;
      this.currentRecording = item;
    },
    deleteRecord() {
      RecordingsAPI.delete(this.currentRecording.id)
        .then(async () => {
          this.$emit('recordings:delete');
          this.onCreation();
          this.closeDeleteConfirmDialog();
        });
    },
  },
  computed: {
    ...mapGetters({
      getPermission: 'getPermission',
    }),
    isReadOnly() {
      return this.getPermission.role == AccessRoles.READER;
    },
  },
};
</script>
