import axios from 'axios';
// import userManager from './oidc-usermanager';
import CONFIG from '../config';
import { getKeycloakUser } from '../actions/keycloakActions'

function configureAxios () {
  if (CONFIG.KEYCLOAK) {
    axios.interceptors.request.use((config) => {
      const loadconfig = async () => {
        // const user = await userManager.getUser();
        const user = getKeycloakUser(); // TODO see if this needs to be an async get
        console.log("configureAxios user", user)
        return {
          ...config,
          headers: {
            Authorization: `Bearer ${user.id_token}`
          }
        };
      };

      return loadconfig();
    });
  }
}

export default configureAxios;
