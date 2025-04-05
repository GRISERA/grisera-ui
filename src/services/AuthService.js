import LS from '@/storage/LS.js';
import Vue from 'vue';
import keycloak from '@/keycloak/keycloak-config';

export default {

  logout() {
    keycloak.logout().then(() => {
      Vue.prototype.$store.commit('setDataset', null);
      Vue.prototype.$store.commit('setUser', null);
      Vue.prototype.$store.commit('setPermissions', null);
      LS.clear('user');
      LS.clear('dataset');
      LS.clear('permissions');
    });
  },

  isAuthenticated() {
    return keycloak.authenticated;
  },

  async getToken() {
    const refreshed = await keycloak.updateToken(5);
    if (refreshed) {
      console.log('Refreshed token');
    }
    return keycloak.token;
  },

  getTokenParsed()  {
    return keycloak.tokenParsed;
  },
};