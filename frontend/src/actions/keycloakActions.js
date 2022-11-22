import CONFIG from '../config'

import ActionTypes from '../constants/actionTypes/Keycloak'
import store from '../store/store'

/*
 * Keycloak Selectors
 */
export const keycloak = () => {
  const userAuth = store.getState().userAuth
  return userAuth.keycloak
}

export const getKeycloakUser = () => {
  const keycloak = store.getState().userAuth.keycloak
  return keycloak?.user
}

/*
 * Keycloak Actions
 */
export const initKeycloak = (keycloak, authenticated) => ({
  payload: { keycloak, authenticated },
  type: ActionTypes.INIT_KEYCLOAK
})

export const initKeycloakError = (error) => ({
  payload: error,
  type: ActionTypes.INIT_KEYCLOAK_ERROR
})

export const loginKeycloakUserSuccess = (token) => ({
  payload: token,
  type: ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS
})

export const loginKeycloakUserError = (error) => ({
  payload: error,
  type: ActionTypes.LOGIN_KEYCLOAK_USER_ERROR
})

export const logoutKeycloakUser = () => ({
  type: ActionTypes.LOGOUT_KEYCLOAK_USER
})

export const login = (hint = 'idir') => (dispatch) => {
  const kc = keycloak()
  kc.login({
    pkceMethod: 'S256',
    redirectUri: CONFIG.KEYCLOAK.CALLBACK_URL,
    idpHint: hint
  })
}

export const logout = () => (dispatch) => {
  const kc = keycloak()
  dispatch(logoutKeycloakUser())
  kc.logout({
    redirectUri: CONFIG.KEYCLOAK.POST_LOGOUT_URL
  })
}
