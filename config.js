export default {
  // 'VUE_APP_API_URL' and 'VUE_APP_AUTH_MS_URL' are needed for entrypoint.sh script
  // used to create prod image of grisera-ui using prod.dockerfile
  apiUrl: 'VUE_APP_API_URL' || 'http://localhost:8085',
  authUrl: 'VUE_APP_AUTH_MS_URL' || 'http://localhost:8081/api',
  keycloakUrl: 'VUE_APP_KEYCLOAK_URL' || 'http://localhost:8090',
  keycloakClientId: 'VUE_APP_KEYCLOAK_CLIENT_ID' || 'grisera-ui',
  realm: 'VUE_APP_KEYCLOAK_REALM' || 'grisera',
  sessionDurationMinutes: 30,
};
