export default {
  // 'process.env.VUE_APP_API_URL' and 'process.env.VUE_APP_AUTH_MS_URL' are needed for entrypoint.sh script
  // used to create prod image of grisera-ui using prod.dockerfile
  apiUrl: process.env.VUE_APP_API_URL || 'process.env.VUE_APP_API_URL',
  authUrl: process.env.VUE_APP_AUTH_MS_URL || 'process.env.VUE_APP_AUTH_MS_URL',
  sessionDurationMinutes: 30,
};
