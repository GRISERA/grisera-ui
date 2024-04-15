<template>
  <v-app-bar
    app
    class="ma-2 rounded-xl"
    :elevation="8"
  >
    <template #default>
      <v-container class="container--fluid pa-0">
        <v-row>
          <v-col class="shrink pa-0">
            <v-list-item>
              <v-list-item-avatar v-if="!$route.meta.disableNavigation">
                <v-icon
                  color="primary"
                  @click="$router.push({name: 'datasets'})"
                >
                  mdi-swap-horizontal-bold
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="caption">
                  Current dataset:
                </v-list-item-title>
                <v-list-item-subtitle class="font-weight-bold subtitle-1">
                  {{ dataset?.name }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-spacer />
          <v-col class="shrink pa-0 mr-4">
            <v-list-item class="d-flex">
              <v-list-item-avatar
                color="accent"
                class="white--text"
              >
                TT
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  Tester Testowy
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ user?.email }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col class="shrink pa-0 my-auto mr-4">
            <v-menu>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-menu-down
                </v-icon>
              </template>
              <v-list>
                <v-list-item @click="logout()">
                  <v-list-item-icon>
                    <v-icon v-text="'mdi-logout'"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';
import AuthService from '@/services/AuthService';

export default {
  name: 'MainAppBar',
  methods: {
    logout() {
      AuthService.logout();
      this.$router.push('/login');
    },
  },
  computed: {
    ...mapState({
      dataset: state => state.dataset,
      user: state => state.user,
    }),
  },
};
</script>
