export default {
  apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:19085',
  authUrl: process.env.VUE_APP_AUTH_MS_URL || 'http://localhost:8081/api',
  sessionDurationMinutes: 30,
};
