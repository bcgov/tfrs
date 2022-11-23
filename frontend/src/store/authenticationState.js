import { put, takeLatest, all } from 'redux-saga/effects'
import { getLoggedInUser } from '../actions/userActions'
import { initKeycloak, loginKeycloakUserSuccess } from '../actions/keycloakActions'
import Keycloak from 'keycloak-js'
import ActionTypes from '../constants/actionTypes/Keycloak'
import configureAxios from './authorizationInterceptor'
import CONFIG from '../config'

export default function * authenticationStateSaga (store) {
  const { token, expiry } = store.getState().userAuth
  const now = Math.round(Date.now() / 1000)
  // Token already exists so setup things here
  if (token && now < expiry) {
    configureAxios()
    yield put(getLoggedInUser())
  }

  const keycloak = new Keycloak({
    url: CONFIG.KEYCLOAK.AUTH_URL,
    realm: CONFIG.KEYCLOAK.REALM,
    clientId: CONFIG.KEYCLOAK.CLIENT_ID
  })
  const authenticated = yield keycloak.init({
    pkceMethod: 'S256',
    redirectUri: CONFIG.KEYCLOAK.CALLBACK_URL,
    idpHint: 'idir'
  })

  yield put(initKeycloak(keycloak, authenticated))

  yield all([
    takeLatest(ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS, getBackendUser)
  ])

  if (authenticated) {
    yield put(loginKeycloakUserSuccess(keycloak.idToken, keycloak.idTokenParsed.exp))
  }
}

function * getBackendUser (action) {
  configureAxios(action.payload)
  yield put(getLoggedInUser())
}
