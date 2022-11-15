import CONFIG from '../config'

import ActionTypes from '../constants/actionTypes/Keycloak'
import store from '../store/store'

/*
 * Keycloak Selectors
 */
export const keycloak = () => {
  const keycloak = store.getState().rootReducer.keycloak
  return keycloak?.keycloak
}

export const getKeycloakUser = () => {
  const keycloak = store.getState().rootReducer.keycloak
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

export const loginKeycloakUserSuccess = (user) => ({
  payload: user,
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
    redirectUri: 'http://localhost:3000', // TODO Setup for dev,test,prod
    idpHint: hint
  })
    .then((user) => {
      console.log('logged in ' + hint + ' user')
      dispatch(loginKeycloakUserSuccess(user))
    })
    .catch((error) => {
      dispatch(loginKeycloakUserError(error))
      console.log('login user error ' + error)
    })
}

export const logout = () => (dispatch) => {
  const kc = keycloak()
  kc.logout({
    redirectUri: CONFIG.KEYCLOAK.POST_LOGOUT_URL
  }).then(() => {
    console.log('logged out user')
    dispatch(logoutKeycloakUser())
  })
}
