<template>
  <v-tab-item>
    <v-container class="access-permissions-settings">
      <!-- Header Section -->
      <div class="mb-6">
        <v-row
          align="center"
          class="mb-3"
        >
          <v-col cols="auto">
            <v-icon
              color="primary"
              large
            >
              mdi-shield-account
            </v-icon>
          </v-col>
          <v-col>
            <h2 class="text-h5 font-weight-bold">
              Access Permissions
            </h2>
            <p class="text-body-2 grey--text mb-0">
              Manage user access and roles for this dataset. Control who can view, edit,
              or administer data within your research project.
            </p>
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <v-alert
          border="left"
          class="mb-4"
          color="warning"
          colored-border
          elevation="2"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-3">
              mdi-security
            </v-icon>
            <div>
              <strong>Security Notice:</strong> Only grant access to trusted users. Owners have full control,
              Editors can modify data, and Readers can only view content. Changes to permissions take effect immediately.
            </div>
          </div>
        </v-alert>
      </div>

      <!-- Add Permission Section -->
      <v-card
        class="mb-4"
        elevation="2"
      >
        <v-card-title class="pb-2">
          <v-icon left>
            mdi-account-plus
          </v-icon>
          Grant Access
        </v-card-title>
        <v-card-text>
          <v-row align="center">
            <v-col
              cols="12"
              md="4"
            >
              <v-autocomplete
                v-model="selectedUser"
                :items="users"
                hide-details
                item-text="username"
                label="Select User"
                outlined
                prepend-inner-icon="mdi-account"
                return-object
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-select
                v-model="selectedRole"
                :items="roles"
                hide-details
                label="Assign Role"
                outlined
                prepend-inner-icon="mdi-shield"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-btn
                :disabled="!selectedUser || !selectedRole"
                block
                color="primary"
                large
                @click="checkPermissions()"
              >
                <v-icon left>
                  mdi-plus
                </v-icon>
                Grant Access
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Permissions Table -->
      <v-card elevation="2">
        <v-card-title>
          <v-icon left>
            mdi-format-list-bulleted
          </v-icon>
          Current Permissions
          <v-spacer />
          <v-chip
            color="primary"
            outlined
          >
            {{ permissions.length }} {{ permissions.length === 1 ? 'User' : 'Users' }}
          </v-chip>
        </v-card-title>
        <v-card-text>
          <base-table
            :headers="headers"
            :items="permissions"
          >
            <template #actions="{ item }">
              <v-btn
                color="error"
                icon
                small
                @click="removePermission(item);"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </base-table>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card class="pa-4">
        <v-card-text>
          You have already set a role for this user. Do you want to overwrite it?
        </v-card-text>
        <v-card-actions class="d-flex justify-sm-end">
          <v-btn
            color="primary"
            @click="updatePermission()"
          >
            Confirm
          </v-btn>
          <v-btn
            color="primary"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-tab-item>
</template>

<script>
import BaseTable from '@/components/base/BaseTable.vue';
import AccessRoles from '@/const/AccessRoles';
import PermissionsService from '@/services/PermissionsService';
import UsersService from '@/services/UsersService';
import { mapGetters } from 'vuex';

export default {
  name: 'AccessPermissionsTab',
  components: {
    BaseTable,
  },
  data: () => {
    return {
      headers: [
        { text: 'Username', value: 'username' },
        { text: 'Role', value: 'role' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      permissions: [],
      users: [],
      roles: [AccessRoles.READER, AccessRoles.EDITOR, AccessRoles.OWNER],
      selectedUser: null,
      selectedRole: null,
      dialog: false,
    };
  },
  created() {
    this.fetchData();
  },
  computed: {
    ...mapGetters({
      getDataset: 'getDataset',
      getUser: 'getUser',
    }),
  },
  methods: {
    checkPermissions() {
      if (this.selectedUser && this.selectedRole) {
        const userPermission = this.permissions.filter(per => per.username == this.selectedUser.username)[0];
        if (userPermission) {
          if (userPermission.role != this.selectedRole) {
            this.dialog = true;
          } else {
            this.selectedUser = null;
            this.selectedRole = null;
          }
        } else {
          this.addPermission();
        }
      }
    },
    addPermission() {
      PermissionsService.add({
          userId: this.selectedUser.id,
          datasetId: this.$store.getters.getDataset.id,
          role: this.selectedRole,
        })
        .then(() => {
          this.selectedUser = null;
          this.selectedRole = null;
          this.getPermissions();
        });
    },
    updatePermission() {
      let permission = this.permissions.filter(permission => permission.username == this.selectedUser.username)[0];
      PermissionsService.update(permission._id, this.selectedRole)
        .then(() => {
          this.dialog = false;
          this.selectedUser = null;
          this.selectedRole = null;
          this.getPermissions();
        });
    },
    removePermission(item) {
      PermissionsService.removePermission(item._id)
        .then(() => {
          this.getPermissions();
        });
    },
    fetchData() {
      UsersService.getUsers()
        .then(({ data }) => {
          this.users = data.users.filter(user => user.id != this.getUser.userId);
          this.getPermissions();
        });
    },
    getPermissions() {
      PermissionsService.getPermissionsByDatasetId(this.getDataset.id)
        .then(({ data }) => {
          this.permissions = [];
          data.forEach(permission => {
            const user = this.users.find(user => user.id == permission.userId);
            if (user) {
              permission.username = user.username;
              this.permissions.push(permission);
            }
          });
        })
        .catch(error => {});
    },
  },
};
</script>

<style scoped>
.access-permissions-settings {
  background-color: #f8f9fa;
}

.v-card {
  border-radius: 12px !important;
}

.v-alert {
  border-left-width: 4px !important;
}

.v-card-title {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}
</style>