<template>
  <div>
    <base-table
      :headers="headers"
      :items="modalities"
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

    <modality-edit-dialog
      v-model="editDialog"
      :modality-data="selectedModality"
      @saved="onModalitySaved"
      @close="editDialog = false"
    />
  </div>
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import ModalitiesAPI from '@/api/ModalitiesAPI';
import ModalityEditDialog from './ModalityEditDialog.vue';

export default {
  name: 'ModalitiesTable',
  components: {
    BaseTable,
    ModalityEditDialog,
  },
  data() {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      modalities: [],
      editDialog: false,
      selectedModality: null,
    };
  },
  created() {
    this.fetchModalities();
  },
  methods: {
    fetchModalities() {
      ModalitiesAPI.index()
        .then(({ data }) => {
          this.modalities = data;
        });
    },
    openEditDialog(modality) {
      this.selectedModality = { ...modality };
      this.editDialog = true;
    },
    onModalitySaved(updatedModality) {
      const index = this.modalities.findIndex(m => m.id === updatedModality.id);
      if (index !== -1) {
        this.$set(this.modalities, index, updatedModality);
      }
    },
  },
};
</script>