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

  yield all([
    takeLatest(ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS, getBackendUser),
    takeLatest(ActionTypes.LOGIN_KEYCLOAK_REFRESH_SUCCESS, getBackendUser),
    takeLatest(ActionTypes.SESSION_TIMEOUT_CONTINUE, silentTokenRefreshSaga, store)
  ])

  const kc = new Keycloak({
    url: CONFIG.KEYCLOAK.AUTH_URL,
    realm: CONFIG.KEYCLOAK.REALM,
    clientId: CONFIG.KEYCLOAK.CLIENT_ID
  })

  yield put(initKeycloak(kc))

  yield put({ type: ActionTypes.LOGGING_IN })

  if (idToken && refreshToken && !expired) {
    console.log('Refreshing Token - Started')
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
      console.log('Refreshing Token - Success')
      yield put(loginKeycloakRefreshSuccess(kc.refreshToken, kc.tokenParsed.exp))
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
      yield put(loginKeycloakUserSuccess(kc.idToken, kc.refreshToken, kc.idTokenParsed.exp))
    }
  }
  yield put({ type: ActionTypes.LOGGING_IN_DONE })
}

function * getBackendUser (action) {
  configureAxios()
  yield put(getLoggedInUser())
}

export function * silentTokenRefreshSaga (store) {
  console.log('Silent Token Refresh - Started')
  const state = store.getState()
  const { keycloak } = state.userAuth
  if (keycloak) {
    console.log('Silent Token Refresh - Authenticating')
    const authenticated = yield keycloak.updateToken(5)
    if (authenticated) {
      console.log('Silent Token Refresh - Success')
      yield put(loginKeycloakSilentRefreshSuccess(keycloak.idToken, keycloak.refreshToken, keycloak.idTokenParsed.exp))
    } else {
      console.log('Silent Token Refresh - Failed')
    }
  }
}
