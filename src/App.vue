<template>
  <v-app>
    <main-navigation-drawer
      v-if="!hideNavigationDrawer"
      :collapse.sync="collapse"
    />
    <main-app-bar
      v-if="!hideMainAppBar"
    />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import MainNavigationDrawer from '@/components/MainNavigationDrawer.vue';
import MainAppBar from '@/components/MainAppBar.vue';

export default {
  components: {
    MainAppBar,
    MainNavigationDrawer,
  },
  data() {
    return {
      collapse: false,
    };
  },
  computed: {
    hideNavigationDrawer() {
      return this.$route.meta?.disableNavigation === true;
    },
    hideMainAppBar() {
      return this.$route.meta?.disableMainAppBar === true;
    },
  },
};
</script>

<style>
::-webkit-scrollbar {
  display: none;
}

#app {
  background-color: #f5f5f5;
}

body {
  font-family: 'Roboto', serif;
  font-weight: normal;
}
</style>
