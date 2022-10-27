import { put, takeLatest, all, call } from 'redux-saga/effects';
import { getLoggedInUser } from '../actions/userActions';
import { initKeycloak, initKeycloakError } from '../actions/keycloakActions';
import Keycloak from 'keycloak-js';
import ActionTypes from '../constants/actionTypes/Keycloak';
import configureAxios from './authorizationInterceptor';

function * getBackendUser (store) {
  const { rootReducer } = store.getState();
  console.log("getBackendUser")
  if (!rootReducer.userRequest.isAuthenticated) {
    yield put(getLoggedInUser());
  }
}

export default function * authenticationStateSaga (store) {

  const keycloak = new Keycloak('keycloak.json');
  console.log("keycloak", keycloak)

  const authenticated = yield keycloak.init({
      pkceMethod: 'S256', 
      redirectUri: 'http://localhost:3000',
      idpHint: 'idir'
    })
  console.log("authenticated", authenticated)

  if(authenticated == null) {
    yield put(initKeycloakError(error))
  } else {
    yield put(initKeycloak(keycloak, authenticated))
  }

  if(authenticated) {
    configureAxios()
  }
    
  // yield put(initKeycloak(keycloak, authenticated))
  //   .then((authenticated) => {
  //   })
  //   .catch(error => {
  //   });

  yield all([
    takeLatest(ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS, getBackendUser, store),
  ]);
}
