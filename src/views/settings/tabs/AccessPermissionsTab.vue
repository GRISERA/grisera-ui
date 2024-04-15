<template>
  <v-tab-item>
    <v-row justify="end">
      <v-col 
        class="d-flex align-center pa-8"
        cols="8"
      >
        <v-autocomplete
          v-model="selectedUser"
          :items="users"
          item-text="username"
          label="Username"
          return-object
          hide-details
          outlined
        />
        <v-spacer/>
        <v-select 
          v-model="selectedRole"
          :items="roles"
          hide-details
          outlined
          label="Role"
        />
        <v-spacer/>
        <v-btn
          :outlined="true"
          @click="checkPermissions()"
        >
          Add
        </v-btn>
        <v-spacer/>
      </v-col>
    </v-row>
    <base-table 
      :headers="headers"
      :items="permissions"
    >
      <template #actions="{ item }">
        <v-icon 
          color="error"
          @click="removePermission(item);"
        >
          mdi-delete
        </v-icon>
      </template>
    </base-table>
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
import UsersService from '@/services/UsersService';
import PermissionsService from '@/services/PermissionsService';
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
      roles: [ AccessRoles.READER, AccessRoles.EDITOR, AccessRoles.OWNER ],
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
      if(this.selectedUser && this.selectedRole) {
        const userPermission = this.permissions.filter(per => per.username == this.selectedUser.username)[0];
        if(userPermission) {
          if(userPermission.role != this.selectedRole) {
            this.dialog = true;
          }
          else {
            this.selectedUser = null;
            this.selectedRole = null;
          }
        }
        else {
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
            if(user) {
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