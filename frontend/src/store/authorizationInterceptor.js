import axios from 'axios'
// import userManager from './oidc-usermanager';
import CONFIG from '../config'
import { keycloak } from '../actions/keycloakActions'

function configureAxios () {
  if (CONFIG.KEYCLOAK) {
    axios.interceptors.request.use((config) => {
      const loadconfig = async () => {
        // const user = await userManager.getUser();
        const kc = keycloak() // TODO see if this needs to be an async get
        // console.log("configureAxios user", kc)
        return {
          ...config,
          headers: {
            Authorization: `Bearer ${kc.idToken}`
          }
        }
      }

      return loadconfig()
    })
  }
}

export default configureAxios
