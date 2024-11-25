import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8090',
    clientId: 'grisera-ui',
    realm: 'grisera',
});
export default keycloak;