import { put, takeLatest, all } from 'redux-saga/effects'
import { getLoggedInUser } from '../actions/userActions'
import {
  initKeycloak,
  loginKeycloakRefreshSuccess,
  loginKeycloakSilentRefreshSuccess,
  loginKeycloakUserSuccess,
  logout,
  resetAuth
} from '../actions/keycloakActions'
import Keycloak from 'keycloak-js'
import ActionTypes from '../constants/actionTypes/Keycloak'
import configureAxios from './authorizationInterceptor'
import CONFIG from '../config'

export default function * authenticationStateSaga (store) {
  yield put(resetAuth())

  const { idToken, refreshToken, expiry } = store.getState().userAuth
  const now = Math.round(Date.now() / 1000)
  const expired = now > expiry

  // Callbacks for session login
  yield all([
    takeLatest(ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS, getBackendUser),
    takeLatest(ActionTypes.LOGIN_KEYCLOAK_REFRESH_SUCCESS, getBackendUser),
    takeLatest(ActionTypes.SESSION_TIMEOUT_CONTINUE, silentTokenRefreshSaga, store)
  ])

  // Initialize Keycloak
  const kc = new Keycloak({
    url: CONFIG.KEYCLOAK.AUTH_URL,
    realm: CONFIG.KEYCLOAK.REALM,
    clientId: CONFIG.KEYCLOAK.CLIENT_ID
  })

  yield put(initKeycloak(kc))

  yield put({ type: ActionTypes.LOGGING_IN })

  // Login session
  if (idToken && refreshToken && !expired) {
    // Refreshing existing token
    const refreshAuthenticated = yield kc.init({
      pkceMethod: 'S256',
      redirectUri: CONFIG.KEYCLOAK.CALLBACK_URL,
      idpHint: 'idir',
      onLoad: 'login-required',
      token: idToken,
      refreshToken
    })
    if (refreshAuthenticated) {
      yield put(loginKeycloakRefreshSuccess(
        kc.refreshToken,
        kc.tokenParsed.exp,
        kc.refreshTokenParsed.exp
      ))
    } else {
      yield put(logout())
    }
  } else {
    // Getting new token
    const authenticated = yield kc.init({
      pkceMethod: 'S256',
      redirectUri: CONFIG.KEYCLOAK.CALLBACK_URL,
      idpHint: 'idir'
    })
    if (authenticated) {
      yield put(loginKeycloakUserSuccess(
        kc.idToken,
        kc.refreshToken,
        kc.idTokenParsed.exp,
        kc.refreshTokenParsed.exp
      ))
    }
  }
  yield put({ type: ActionTypes.LOGGING_IN_DONE })
}

function * getBackendUser (action) {
  configureAxios()
  yield put(getLoggedInUser())
}

export function * silentTokenRefreshSaga (store) {
  const state = store.getState()
  const { keycloak } = state.userAuth
  if (keycloak) {
    const authenticated = yield keycloak.updateToken(5)
    if (authenticated) {
      yield put(loginKeycloakSilentRefreshSuccess(
        keycloak.idToken,
        keycloak.refreshToken,
        keycloak.idTokenParsed.exp,
        keycloak.refreshTokenParsed.exp
      ))
    }
  }
}
