<template>
  <div class="parameters-table">
    <!-- Empty State -->
    <v-card
      v-if="parameters.length === 0"
      class="text-center pa-8"
      flat
    >
      <v-icon
        class="mb-4"
        color="grey lighten-1"
        size="64"
      >
        mdi-tune-variant
      </v-icon>
      <h3 class="text-h6 grey--text mb-2">
        No Parameters Yet
      </h3>
      <p class="text-body-2 grey--text mb-4">
        Create your first {{ transformParameterName(type) }} parameter to get started.
      </p>
      <v-btn
        color="primary"
        large
        @click="dialog = true"
      >
        <v-icon left>
          mdi-plus
        </v-icon>
        Create Parameter
      </v-btn>
    </v-card>

    <!-- Data Table -->
    <v-data-table
      v-else
      :headers="headers"
      :items="parameters"
      elevation="0"
      hide-default-footer
    >
      <template #top>
        <div class="d-flex justify-end mb-3">
          <v-btn
            color="primary"
            @click="dialog = true"
          >
            <v-icon left>
              mdi-plus
            </v-icon>
            Add Parameter
          </v-btn>
        </div>
      </template>

      <template #[`item.name`]="{ item }">
        <div class="d-flex align-center">
          <v-avatar
            class="mr-3"
            color="primary lighten-4"
            size="36"
          >
            <v-icon color="primary">
              mdi-tune
            </v-icon>
          </v-avatar>
          <div>
            <div class="font-weight-medium">
              {{ item.name }}
            </div>
            <div class="caption grey--text">
              {{ item.key }}
            </div>
          </div>
        </div>
      </template>

      <template #[`item.options`]="{ item }">
        <div
          v-if="item.options && item.options.length > 0"
          class="d-flex align-center"
        >
          <v-chip
            color="primary"
            outlined
            small
            class="mr-2"
          >
            {{ item.options.length }} {{ item.options.length === 1 ? 'option' : 'options' }}
          </v-chip>
          <v-btn
            icon
            small
            color="primary"
            @click="viewOptions(item)"
          >
            <v-icon small>
              mdi-eye
            </v-icon>
          </v-btn>
        </div>
        <span
          v-else
          class="grey--text text-caption"
        >No options</span>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn
          class="mr-1"
          icon
          small
          @click="editItem(item)"
        >
          <v-icon
            color="primary"
            small
          >
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn
          icon
          small
          @click="deleteItem(item)"
        >
          <v-icon
            color="error"
            small
          >
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Create/Edit Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          <v-icon
            color="white"
            left
          >
            mdi-tune
          </v-icon>
          {{ editedItem.id ? 'Edit' : 'Create' }} {{ transformParameterName(type) }} Parameter
        </v-card-title>

        <v-card-text class="pt-6">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.name"
                hint="Enter a descriptive name for this parameter"
                label="Parameter Name"
                outlined
                persistent-hint
                prepend-inner-icon="mdi-tag"
                required
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="!editedItem.name"
            color="primary"
            @click="save"
          >
            {{ editedItem.id ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="dialogDelete"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="text-h5 error white--text">
          <v-icon
            color="white"
            left
          >
            mdi-delete
          </v-icon>
          Confirm Deletion
        </v-card-title>

        <v-card-text class="pt-6">
          <div class="d-flex align-start">
            <v-icon
              class="mr-3 mt-1"
              color="warning"
            >
              mdi-alert
            </v-icon>
            <div>
              <p class="text-body-1 mb-2">
                Are you sure you want to delete this parameter?
              </p>
              <p class="text-body-2 grey--text">
                This action cannot be undone. The parameter may be used in existing data entries.
              </p>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn
            text
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            @click="deleteItemConfirm"
          >
            Delete Parameter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Options View Dialog -->
    <v-dialog
      v-model="optionsDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          <v-icon
            color="white"
            left
          >
            mdi-format-list-bulleted
          </v-icon>
          Parameter Options
        </v-card-title>

        <v-card-text class="pt-6">
          <div v-if="selectedParameter">
            <h3 class="text-h6 mb-3">
              {{ selectedParameter.name }}
            </h3>
            <p class="text-body-2 grey--text mb-4">
              Key: <code>{{ selectedParameter.key }}</code>
            </p>

            <v-list v-if="selectedParameter.options && selectedParameter.options.length > 0">
              <v-list-item
                v-for="(option, index) in selectedParameter.options"
                :key="index"
                class="px-0"
              >
                <v-list-item-avatar>
                  <v-avatar
                    size="32"
                    color="primary lighten-4"
                  >
                    <span class="primary--text font-weight-medium">{{ index + 1 }}</span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">
                    {{ option }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-alert
              v-else
              text
              color="info"
              icon="mdi-information"
            >
              This parameter has no predefined options.
            </v-alert>
          </div>
        </v-card-text>

        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn
            color="primary"
            @click="optionsDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ParametersAPI from '@/api/ParametersAPI';

export default {
  name: 'ParametersTableComponent',
  props: {
    params: {
      type: Array,
      default: () => (
        []
      ),
    },
    type: {
      type: String,
      default: undefined,
    },
  },
  data: () => (
    {
      parameters: undefined,
      dialog: false,
      dialogDelete: false,
      optionsDialog: false,
      selectedParameter: null,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Options', value: 'options', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
      },
      defaultItem: {
        name: '',
      },
    }
  ),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.close();
    },
    optionsDialog(val) {
      if (!val) {
        this.selectedParameter = null;
      }
    },
    params: {
      handler(newParams) {
        this.parameters = [...this.filterParameters(newParams)];
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.parameters = this.filterParameters(this.params);
  },
  methods: {
    editItem(item) {
      this.actionWithItem(item, true);
    },

    deleteItem(item) {
      this.actionWithItem(item, false);
    },

    actionWithItem(item, isEdit) {
      this.editedIndex = this.getParamterIndexByName(item.name);
      this.editedItem = Object.assign({}, this.getParameterByName(item.name));
      if (isEdit) {
        this.dialog = true;
      } else {
        this.dialogDelete = true;
      }
    },

    deleteItemConfirm() {
      ParametersAPI.delete(this.editedIndex).then(() => {
        this.refreshParameters();
      });
      this.close();
    },

    close() {
      this.dialog = false;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      if (this.editedItem.id) {
        // Update existing parameter
        await this.updateParameter(this.editedItem);
        await this.refreshParameters();
      } else {
        // Create new parameter
        this.editedItem.key = this.camelCase(this.editedItem.name);
        this.editedItem.type = this.type;
        this.editedItem.options = [];
        await this.storeParameter(this.editedItem);
        await this.refreshParameters();
      }
      this.close();
    },
    async storeParameter(parameter) {
      return ParametersAPI.store(parameter);
    },
    async refreshParameters() {
      const { data } = await ParametersAPI.index();
      this.parameters = [...this.filterParameters(data)];
      this.$emit('parameters-updated', data);
    },
    filterParameters(parameters) {
      return parameters.filter((param) => param.type === this.type);
    },

    getParameterByName(name) {
      return this.parameters.find((param) => param.name === name);
    },

    getParamterIndexByName(name) {
      return this.getParameterByName(name).id;
    },

    async updateParameter(parameter) {
      return ParametersAPI.update(parameter);
    },

    camelCase(str) {
      return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase());
    },

    transformParameterName(name) {
      return name.replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase());
    },

    viewOptions(item) {
      this.selectedParameter = item;
      this.optionsDialog = true;
    },
  },
};
</script>

<style scoped>
.parameters-table {
  background-color: transparent;
}

.v-data-table {
  border-radius: 8px !important;
}

.v-data-table .v-data-table__wrapper {
  border-radius: 8px;
}

.v-card {
  border-radius: 12px !important;
}

.v-dialog .v-card {
  border-radius: 12px !important;
}

.v-card-title {
  font-weight: 600;
  font-size: 1.1rem;
}

.v-btn {
  text-transform: none !important;
  font-weight: 500;
}

.v-chip.v-size--small {
  font-size: 10px !important;
  height: 20px !important;
  padding: 0 8px !important;
}

.v-avatar {
  border: 2px solid rgba(var(--v-primary-base), 0.1);
}

.v-text-field .v-input__prepend-inner {
  margin-top: 8px;
}

.font-weight-medium {
  font-weight: 500 !important;
}

.caption {
  font-size: 0.75rem !important;
  line-height: 1.25;
}

.v-alert {
  border-left-width: 4px !important;
}

.v-card-text {
  padding: 24px !important;
}

/* Mobile responsiveness */
@media (max-width: 960px) {
  .v-data-table .v-data-table-header__content {
    font-size: 0.875rem;
  }

  .v-avatar {
    width: 32px !important;
    height: 32px !important;
  }

  .v-avatar .v-icon {
    font-size: 18px !important;
  }
}

@media (max-width: 600px) {
  .v-card-text {
    padding: 16px !important;
  }

  .v-data-table .v-data-table__wrapper {
    overflow-x: auto;
  }

  .v-dialog {
    margin: 16px;
  }

  .v-dialog .v-card {
    margin: 0;
  }

  .font-weight-medium {
    font-size: 0.875rem !important;
  }

  .caption {
    font-size: 0.6875rem !important;
  }
}
</style>
