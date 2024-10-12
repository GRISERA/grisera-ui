export default {
  apiUrl: process.env.VUE_APP_API_URL || 'https://grisera-backend.affectivese.org',
  authUrl: process.env.VUE_APP_AUTH_MS_URL || 'https://grisera-authms.affectivese.org/api',
  sessionDurationMinutes: 30,
};
