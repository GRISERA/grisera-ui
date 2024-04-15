<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="parameters"
      hide-default-footer
    >
      <template #top>
        <v-toolbar
          flat
        >
          <v-spacer />
          <v-dialog
            v-model="dialog"
            max-width="500px"
          >
            <template #activator="{ on, attrs }">
              <v-btn
                :outlined="true"
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                Create
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Parameter - {{ type }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col
                      cols="50"
                      sm="10"
                      md="10"
                    >
                      <v-text-field
                        v-model="editedItem.name"
                        label="Name"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="dialogDelete"
            max-width="500px"
          >
            <v-card>
              <v-card-title class="text-h5">
                This parameter is used by few elements. Are you sure you want to delete
                it?
              </v-card-title>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="deleteItemConfirm"
                >
                  OK
                </v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import ParametersAPI from '@/api/ParametersAPI';

export default {
  name: 'ParametersTableComponent',
  props: {
    params: {
      type: Array,
      default: () => ([]),
    },
    type: {
      type: String,
      default: undefined,
    },
  },
  data: () => ({
    parameters: undefined,
    dialog: false,
    dialogDelete: false,
    headers: [
      { text: 'Index', align: 'start', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
    },
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.close();
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

    save() {
      if (this.editedIndex > -1) {
        this.updateParameter(this.editedItem);
        this.refreshParameters();
      } else {
        this.editedItem.key = this.camelCase(this.editItem.name);
        this.editedItem.type = this.type;
        this.editedItem.options = [];
        this.storeParameter(this.editedItem);
        this.refreshParameters();
      }
      this.close();
    },
    storeParameter(parameter) {
      ParametersAPI.store(parameter)
          .then(() => {
            this.refreshParameters();
          });
    },
    refreshParameters() {
      ParametersAPI.index().then(({ data }) => {
        this.parameters = this.filterParameters(data);
      });
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

    updateParameter(parameter) {
      ParametersAPI.update(parameter);
    },

    camelCase(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      }).replace(/\s+/g, '');
    },
  },
};
</script>
