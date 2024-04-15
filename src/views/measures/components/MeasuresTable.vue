<template>
  <div>
    <base-table
      :headers="headers"
      :items="measures"
    >
      <template #[`item.definedValue`]="{ item }">
        <template v-if="item.definedValue">
          <v-chip-group column>
            <v-chip
              v-for="(value, index) in item.definedValue"
              :key="index"
              :small="true"
            >
              {{ value.definedValue }}
            </v-chip>
          </v-chip-group>
        </template>
        <template v-else>
          -
        </template>
      </template>
      <template #[`item.datatype`]="{ item }">
        <template v-if="item.datatype">
          {{ item.datatype }}
        </template>
        <template v-else>
          string
        </template>
      </template>
      <template #[`item.unit`]="{ item }">
        <template v-if="item.unit">
          {{ item.unit }}
        </template>
        <template v-else>
          -
        </template>
      </template>
      <template #[`item.range`]="{ item }">
        {{ item.rangeStart }} - {{ item.rangeEnd }}
      </template>
      <template #[`item.type`]="{ item }">
        <td>
          <v-chip
            :color="getTypeChipColor(item.type)"
            :small="true"
          >
            {{ item.type }}
          </v-chip>
        </td>
      </template>
      <template #[`item.source`]="{ item }">
        <td>
          <v-chip
            :color="getSourceChipColor(item.source)"
            :small="true"
          >
            {{ item.source }}
          </v-chip>
        </td>
      </template>
      <template 
        #actions="{ item }"
        v-if="canPerformActions"
      >
        <v-icon
          class="mr-2"
          color="primary"
          @click.stop.prevent="edit(item)"
        >
          mdi-pen
        </v-icon>
        <v-icon
          color="error"
          @click.stop.prevent="openDeleteConfirmDialog(item)"

        >
          mdi-delete
        </v-icon>
      </template>
    </base-table>
    <delete-confirm-dialog
      :active.sync="deleteConfirmDialogActive"
      title="Delete measure"
      @cancel="closeDeleteConfirmDialog"
      @submit="deleteMeasure"
    >
      <div class="py-4">
        Are you sure you want to delete the selected item?
      </div>
    </delete-confirm-dialog>
  </div>
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import MeasuresAPI from '@/api/MeasuresAPI';
import DeleteConfirmDialog from '@/components/dialog/DeleteConfirmDialog.vue';

export default {
  name: 'MeasuresTable',
  components: {
    BaseTable,
    DeleteConfirmDialog,
  },
  props: {
    canPerformActions: Boolean,
  },
  data() {
    return {
      deleteConfirmDialogActive: false,
      current: undefined,
      headers: [
        { text: 'ID', value: 'id', sortable: false, width: '5%' },
        { text: 'Name', value: 'name' },
        { text: 'Source', value: 'source' },
        { text: 'Type', value: 'type' },
        { text: 'Datatype', value: 'datatype' },
        { text: 'Range', value: 'range' },
        { text: 'Unit', value: 'unit' },
        { text: 'Defined Values', value: 'definedValue' },
      ],
      measures: [],
    };
  },
  created() {
    if(this.canPerformActions) {
      this.headers.push({ text: 'Actions', value: 'actions', sortable: false });
    }
    this.loadData();
  },
  methods: {
    loadData() {
      MeasuresAPI.index()
          .then(({ data }) => {
            this.measures = data;
          });
    },
    edit(item) {
      this.$router.push({
        name: 'measure-edit',
        params: {
          id: item.id,
        },
      });
    },
    closeDeleteConfirmDialog() {
      this.deleteConfirmDialogActive = false;
      this.current = undefined;
    },
    openDeleteConfirmDialog(item) {
      this.deleteConfirmDialogActive = true;
      this.current = item;
    },
    deleteMeasure() {
      MeasuresAPI.delete(this.current.id)
          .then(async () => {
            this.closeDeleteConfirmDialog();
            this.loadData();
          });
    },
    getSourceChipColor(type) {
      return {
        ['Ekman']: 'accent',
        ['Neutral']: 'primary',
        ['PAD']: 'success',
        ['User defined']: 'info',
      }[type];
    },
    getTypeChipColor(type) {
      return {
        ['Categorical']: 'primary',
        ['Numeric']: 'info',
      }[type];
    },
  },
};
</script>
