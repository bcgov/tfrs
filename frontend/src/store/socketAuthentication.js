import { put, takeLatest, all } from 'redux-saga/effects'
import { getKeycloakUser } from '../actions/keycloakActions'
import ActionTypes from '../constants/actionTypes/Keycloak'

function socketAuthenticate (dispatch) {
  console.log('socketAuthenticate')

  const user = getKeycloakUser() // TODO see if this needs to be an asycn get

  if (!user || !user.id_token) { return }

  dispatch({
    type: 'socketio/AUTHENTICATE',
    token: user.id_token
  })
}

function * socketDeauthenticate () {
  yield put({
    type: 'socketio/DEAUTHENTICATE'
  })
}

export default function * socketAuthenticationSaga (store) {
  yield all([
    takeLatest(ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS, socketAuthenticate, store.dispatch),
    takeLatest('redux-oidc/USER_EXPIRED', socketDeauthenticate) // TODO Handle user expired via keycloak
  ])
}
