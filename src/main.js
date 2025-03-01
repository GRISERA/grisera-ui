import LocalStorageService from '@/storage/LocalStorageService';
import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';
import keycloak from '@/keycloak/keycloak-config';

Vue.config.productionTip = false;

LocalStorageService.init();

keycloak.init({ onLoad: 'login-required' })
    .then(authenticated => {
      if (authenticated) {
        new Vue({
          store,
          vuetify,
          router,
          keycloak,
          render: h => h(App),
          created() {
            Vue.prototype.$keycloak = keycloak; // Make Keycloak instance available globally
          },
        }).$mount('#app');
      } else {
        console.warn('User is not authenticated!');
      }
    })
    .catch(err => {
      console.error('Keycloak initialization failed:', err);
    });
