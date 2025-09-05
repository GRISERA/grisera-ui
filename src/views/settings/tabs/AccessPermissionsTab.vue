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
                label="Select User"
                outlined
                prepend-inner-icon="mdi-account"
                return-object
              >
                <template #item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.username }}
                      <v-chip
                        v-if="item.id === getUser.sub"
                        class="ml-2"
                        color="primary"
                        outlined
                        x-small
                      >
                        You
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <template #selection="{ item }">
                  {{ item.username }}
                  <v-chip
                    v-if="item.id === getUser.sub"
                    class="ml-2"
                    color="primary"
                    outlined
                    x-small
                  >
                    You
                  </v-chip>
                </template>
              </v-autocomplete>
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
            <template #username="{ item }">
              {{ item.username }}
              <v-chip
                v-if="item.userId === getUser.sub"
                class="ml-2"
                color="primary"
                outlined
                x-small
              >
                You
              </v-chip>
            </template>
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
      max-width="480px"
      persistent
    >
      <v-card
        class="elevation-4"
        rounded="lg"
      >
        <v-card-title class="warning white--text pa-4">
          <v-icon
            color="white"
            left
          >
            mdi-alert
          </v-icon>
          Role Already Assigned
        </v-card-title>
        <v-card-text class="pa-6">
          <div class="d-flex align-center mb-3">
            <v-avatar
              class="mr-3"
              color="grey lighten-2"
              size="40"
            >
              <v-icon color="grey darken-1">
                mdi-account
              </v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">
                {{ selectedUser ? selectedUser.username : '' }}
                <v-chip
                  v-if="selectedUser && selectedUser.id === getUser.sub"
                  class="ml-2"
                  color="primary"
                  outlined
                  x-small
                >
                  You
                </v-chip>
              </div>
              <div class="text-caption grey--text">
                Already has role assigned
              </div>
            </div>
          </div>
          <div class="mb-4">
            <v-card
              class="pa-3"
              color="grey lighten-4"
              flat
            >
              <div class="text-center">
                <v-chip
                  color="grey lighten-1"
                  outlined
                  small
                >
                  {{ getCurrentUserRole() }}
                </v-chip>
                <v-icon
                  class="mx-3"
                  color="grey"
                >
                  mdi-arrow-right
                </v-icon>
                <v-chip
                  color="primary"
                  small
                >
                  {{ selectedRole }}
                </v-chip>
              </div>
            </v-card>
          </div>
          <p class="mb-0">
            This user already has a role assigned. Do you want to overwrite their current role with the new one?
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            outlined
            @click="dialog = false"
          >
            <v-icon left>
              mdi-close
            </v-icon>
            Cancel
          </v-btn>
          <v-btn
            color="warning"
            @click="updatePermission()"
          >
            <v-icon left>
              mdi-check
            </v-icon>
            Update Role
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
  computed: {
    ...mapGetters({
      getDataset: 'getDataset',
      getUser: 'getUser',
    }),
  },
  created() {
    this.fetchData();
  },
  methods: {
    checkPermissions() {
      if (this.selectedUser && this.selectedRole) {
        const userPermission = this.permissions.filter(per => per.username === this.selectedUser.username)[0];
        if (userPermission) {
          if (userPermission.role !== this.selectedRole) {
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
      let permission = this.permissions.filter(permission => permission.username === this.selectedUser.username)[0];
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
          this.users = data.users;
          this.getPermissions();
        });
    },
    getPermissions() {
      PermissionsService.getPermissionsByDatasetId(this.getDataset.id)
        .then(({ data }) => {
          this.permissions = [];
          data.forEach(permission => {
            const user = this.users.find(user => user.id === permission.userId);
            if (user) {
              permission.username = user.username;
              this.permissions.push(permission);
            }
          });
        })
        .catch(error => {});
    },
    getCurrentUserRole() {
      if (this.selectedUser) {
        const userPermission = this.permissions.find(per => per.username === this.selectedUser.username);
        return userPermission ? userPermission.role : '';
      }
      return '';
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