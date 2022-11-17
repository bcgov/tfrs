import { put, takeLatest, all } from 'redux-saga/effects'
import { getLoggedInUser } from '../actions/userActions'
import { initKeycloak, initKeycloakError, loginKeycloakUserSuccess } from '../actions/keycloakActions'
import Keycloak from 'keycloak-js'
import ActionTypes from '../constants/actionTypes/Keycloak'
import configureAxios from './authorizationInterceptor'
import CONFIG from '../config'

function * getBackendUser (store) {
  const { rootReducer } = store.getState()
  console.log('getBackendUser')
  if (!rootReducer.userRequest.isAuthenticated) {
    yield put(getLoggedInUser())
  }
}

export default function * authenticationStateSaga (store) {
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

  if (authenticated == null) {
    yield put(initKeycloakError('keycloak authentication failed'))
  } else {
    yield put(initKeycloak(keycloak, authenticated))
  }

  yield all([
    takeLatest(ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS, getBackendUser, store)
  ])

  if (authenticated) {
    configureAxios()
    const user = yield keycloak.loadUserInfo()
    yield put(loginKeycloakUserSuccess(user))
  }
}
