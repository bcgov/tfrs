import axios from 'axios'
import CONFIG from '../config'
import store from './store'

function configureAxios () {
  if (CONFIG.KEYCLOAK) {
    axios.interceptors.request.use((config) => {
      const loadconfig = () => {
        const token = store.getState().userAuth.idToken
        return {
          ...config,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }

      return loadconfig()
    })
  }
}

export default configureAxios
