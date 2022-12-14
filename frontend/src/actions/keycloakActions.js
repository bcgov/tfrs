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
export const initKeycloak = (keycloak) => ({
  payload: { keycloak },
  type: ActionTypes.INIT_KEYCLOAK
})

export const initKeycloakError = (error) => ({
  payload: error,
  type: ActionTypes.INIT_KEYCLOAK_ERROR
})

export const resetAuth = () => ({
  type: ActionTypes.RESET_AUTH
})

export const loginKeycloakUserSuccess = (idToken, refreshToken, expiry) => ({
  payload: { idToken, refreshToken, expiry },
  type: ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS
})

export const loginKeycloakRefreshSuccess = (refreshToken, expiry) => ({
  payload: { refreshToken, expiry },
  type: ActionTypes.LOGIN_KEYCLOAK_REFRESH_SUCCESS
})

export const loginKeycloakSilentRefreshSuccess = (idToken, refreshToken, expiry) => ({
  payload: { idToken, refreshToken, expiry },
  type: ActionTypes.LOGIN_KEYCLOAK_SILENT_REFRESH_SUCCESS
})

export const loginKeycloakUserError = (error) => ({
  payload: error,
  type: ActionTypes.LOGIN_KEYCLOAK_USER_ERROR
})

export const logoutKeycloakUser = () => ({
  type: ActionTypes.LOGOUT_KEYCLOAK_USER
})

export const login = (idpHint = 'idir') => (dispatch) => {
  const kc = keycloak()
  dispatch({ type: ActionTypes.LOGGING_IN })
  kc.login({
    pkceMethod: 'S256',
    redirectUri: CONFIG.KEYCLOAK.CALLBACK_URL,
    idpHint
  })
}

export const logout = () => (dispatch) => {
  const userAuth = store.getState().userAuth
  const kc = keycloak()
  const token = userAuth.idToken

  dispatch(logoutKeycloakUser())

  const kcLogoutUrl = kc.endpoints.logout() +
    '?post_logout_redirect_uri=' + CONFIG.KEYCLOAK.POST_LOGOUT_URL +
    '&client_id=' + kc.clientId +
    '&id_token_hint=' + token

  const url = CONFIG.KEYCLOAK.SM_LOGOUT_URL + encodeURIComponent(kcLogoutUrl)

  window.location = url
}
