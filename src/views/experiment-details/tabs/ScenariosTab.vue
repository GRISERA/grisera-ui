<template>
  <v-tab-item>
    <v-container class="container--fluid">
      <v-row>
        <v-col class="col-12 text-right">
          <v-row justify="end">
            <v-btn
              :outlined="true"
              class="ma-4"
              @click="$router.push({ name: 'experiment-scenario-add', params: { experiment: experiment.id } })"
              v-if="!isReadOnly"
            >
              Create
            </v-btn>
          </v-row>
        </v-col>
        <v-col
          v-if="scenarios?.length"
          class="col-12 pa-6"
        >
          <scenarios-listing-component
            :scenarios="scenarios"
            @scenario:edit="editScenario"
            @scenario:delete="openDeleteConfirmDialog"
            :canPerformActions="!isReadOnly"
          />
        </v-col>
      </v-row>
    </v-container>
    <delete-confirm-dialog
      :active.sync="deleteConfirmDialogActive"
      title="Delete scenario"
      @cancel="closeDeleteConfirmDialog"
      @submit="deleteScenario"
    >
      <div class="py-4">
        Are you sure you want to delete the selected item?
      </div>
    </delete-confirm-dialog>
  </v-tab-item>
</template>

<script>
import ScenariosListingComponent from '@/components/ScenariosListingComponent.vue';
import ScenariosAPI from '@/api/ScenariosAPI';
import DeleteConfirmDialog from '@/components/dialog/DeleteConfirmDialog.vue';
import AccessRoles from '@/const/AccessRoles';
import { mapGetters } from 'vuex';

export default {
  name: 'ScenariosTab',
  components: {
    DeleteConfirmDialog,
    ScenariosListingComponent,
  },
  props: {
    scenarios: {
      type: Array,
      default: () => ([]),
    },
    experiment: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      deleteConfirmDialogActive: false,
      currentScenario: undefined,
    };
  },
  methods: {
    editScenario(item) {
      this.$router.push({ name: 'experiment-scenario-edit', params: { id: item.id, experiment: this.experiment.id } });
    },
    closeDeleteConfirmDialog() {
      this.deleteConfirmDialogActive = false;
      this.currentScenario = undefined;
    },
    openDeleteConfirmDialog(item) {
      this.deleteConfirmDialogActive = true;
      this.currentScenario = item;
    },
    deleteScenario() {
      ScenariosAPI.delete(this.currentScenario.id)
          .then(async () => {
            this.$emit('scenario:delete');
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
