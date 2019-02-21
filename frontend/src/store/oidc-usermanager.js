import { createUserManager } from 'redux-oidc';
import CONFIG from '../config';

const settings = {
  authority: CONFIG.KEYCLOAK.AUTHORITY,
  client_id: CONFIG.KEYCLOAK.CLIENT_ID,
  redirect_uri: CONFIG.KEYCLOAK.CALLBACK_URL,
  automaticSilentRenew: true,
  silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/token_renew.html`,
  response_type: 'token id_token'
};

const userManager = createUserManager(settings);

export default userManager;
