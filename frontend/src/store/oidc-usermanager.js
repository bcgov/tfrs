import {createUserManager} from "redux-oidc";
import CONFIG from '../config';

const settings = {
  authority: CONFIG.KEYCLOAK.AUTHORITY,
  client_id: CONFIG.KEYCLOAK.CLIENT_ID,
  redirect_uri: CONFIG.KEYCLOAK.CALLBACK_URL
};

const userManager = createUserManager(settings);

export default userManager;

