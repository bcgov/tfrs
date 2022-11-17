import { put, takeLatest, delay } from 'redux-saga/effects'
import { signUserOut } from '../actions/userActions'
import ActionTypes from '../constants/actionTypes/Keycloak'

const NON_RESETTING_ACTIONS = [
  'RECEIVE_NOTIFICATIONS',
  'RECEIVE_NOTIFICATIONS_COUNT',
  'GET_NOTIFICATIONS_COUNT',
  'SERVER_INITIATED_CONNECTION_RELOAD',
  ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS,
  'redux-oidc/USER_EXPIRING', // TODO Handle user expired via keycloak
  'SESSION_TIMEOUT_RESET',
  'SESSION_TIMEOUT_WARNING',
  'SESSION_TIMEOUT_EXPIRED'
]

function * resetTimer () {
  console.log('resetting timer')
  yield put({ type: 'SESSION_TIMEOUT_RESET' })
  yield delay(10 * 60 * 1000)
  yield put({ type: 'SESSION_TIMEOUT_WARNING' })
  yield delay(3 * 60 * 1000)
  yield put({ type: 'SESSION_TIMEOUT_EXPIRED' })
  yield put(signUserOut())
}

export default function * sessionTimeoutSaga () {
  yield takeLatest(
    action => (!NON_RESETTING_ACTIONS.includes(action.type)),
    resetTimer
  )
}
