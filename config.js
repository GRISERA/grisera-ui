export default {
  // 'VUE_APP_API_URL' and 'VUE_APP_AUTH_MS_URL' are needed for entrypoint.sh script
  // used to create prod image of grisera-ui using prod.dockerfile
  apiUrl: 'http://localhost:8085',
  authUrl:  'http://localhost:8081/api',
  keycloakUrl:  'http://localhost:8090',
  keycloakClientId: 'grisera-ui',
  realm: 'grisera',
  sessionDurationMinutes: 30,
};
