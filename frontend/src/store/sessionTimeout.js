import { put, takeLatest, delay, call } from 'redux-saga/effects'
import { logout } from '../actions/keycloakActions'
import { silentTokenRefreshSaga } from './authenticationState'

const NON_RESETTING_ACTIONS = [
  'RECEIVE_NOTIFICATIONS',
  'RECEIVE_NOTIFICATIONS_COUNT',
  'GET_NOTIFICATIONS_COUNT',
  'SERVER_INITIATED_CONNECTION_RELOAD',
  'SESSION_TIMEOUT_RESET',
  'SESSION_TIMEOUT_WARNING',
  'SESSION_TIMEOUT_EXPIRED',
  'SESSION_TIMEOUT_CONTINUE'
]

function * resetTimer (store) {
  const { keycloak, expiry } = store.getState().userAuth
  if (!keycloak?.authenticated) {
    return
  }
  // Check for expired token
  const now = Math.round(Date.now() / 1000)
  const timeLeft = (expiry - now) * 1000
  console.log('Session Time Left - ' + timeLeft / 1000)
  if (timeLeft < 0) {
    yield put(logout())
  }
  // Montior remaining session length
  yield put({ type: 'SESSION_TIMEOUT_RESET' })
  yield delay(timeLeft - (30000)) // 30 seconds before expiry
  yield call(silentTokenRefreshSaga, store)
  yield delay(timeLeft - 15000) // 15 seconds before expiry
  yield call(silentTokenRefreshSaga, store)
  yield delay(timeLeft - 10000)
  // If silent renew fails, we then show the continue session button
  yield put({ type: 'SESSION_TIMEOUT_WARNING' })
  yield delay(60000)
  yield put({ type: 'SESSION_TIMEOUT_EXPIRED' })
  yield put(logout())
}

export default function * sessionTimeoutSaga (store) {
  yield takeLatest(
    action => (!NON_RESETTING_ACTIONS.includes(action.type)),
    resetTimer,
    store
  )
}
