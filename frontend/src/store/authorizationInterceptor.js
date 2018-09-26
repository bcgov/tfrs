import axios from 'axios';
import userManager from './oidc-usermanager';
import CONFIG from '../config';

function configureAxios () {
  if (CONFIG.KEYCLOAK) {
    console.log('adding token to request');

    axios.interceptors.request.use((config) => {
      const loadconfig = async () => {
        const user = await userManager.getUser();
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
