import Keycloak from 'keycloak-js';
import config from '../../config.js';

const keycloak = new Keycloak({
    url: config.keycloakUrl,
    clientId: config.keycloakClientId,
    realm: config.realm,
});
export default keycloak;