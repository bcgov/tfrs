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

export const resetToken = () => ({
  type: ActionTypes.RESET_TOKEN
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

export const login = (hint = 'idir') => (dispatch) => {
  const kc = keycloak()
  dispatch({ type: ActionTypes.LOGGING_IN })
  kc.login({
    pkceMethod: 'S256',
    redirectUri: CONFIG.KEYCLOAK.CALLBACK_URL,
    idpHint: hint
  })
}

export const logout = (token) => (dispatch) => {
  const userAuth = store.getState().userAuth
  const kc = keycloak()
  dispatch(logoutKeycloakUser())
  const url = kc.endpoints.logout() +
    '?client_id=' + encodeURIComponent(kc.clientId) +
    '&post_logout_redirect_uri=' + encodeURIComponent(CONFIG.KEYCLOAK.POST_LOGOUT_URL) +
    '&id_token_hint=' + encodeURIComponent(userAuth.idToken)
  window.location = url
}
