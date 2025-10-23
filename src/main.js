import LocalStorageService from '@/storage/LocalStorageService';
import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import keycloak from '@/keycloak/keycloak-config';
import PermissionsService from '@/services/PermissionsService';

Vue.config.productionTip = false;

LocalStorageService.init();

keycloak.onAuthSuccess = () => {
    PermissionsService.getUserPermissions(keycloak.tokenParsed.sub).then(data =>
        router.app.$store.commit('setPermissions', data.data));
};

keycloak.onAuthError = () => {
    router.app.$store.commit('setPermissions', null);
};

keycloak.onAuthLogout = () => {
    router.app.$store.commit('setPermissions', null);
};

keycloak.init({ onLoad: 'login-required' })
    .then(authenticated => {
      if (authenticated) {
        new Vue({
          store,
          vuetify,
          router,
          keycloak,
          created() {
            Vue.prototype.$keycloak = keycloak; // Make Keycloak instance available globally
          },
          render: h => h(App),
        }).$mount('#app');
      } else {
        console.warn('User is not authenticated!');
      }
    })
    .catch(err => {
      console.error('Keycloak initialization failed:', err);
    });

