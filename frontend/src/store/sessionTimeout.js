import { put, takeLatest, delay } from 'redux-saga/effects'
import { logout } from '../actions/keycloakActions'
// import { silentTokenRefreshSaga } from './authenticationState'

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
  const { expiry } = store.getState().userAuth
  const now = Math.round(Date.now() / 1000)
  const timeLeft = (expiry - now) * 1000

  yield put({ type: 'SESSION_TIMEOUT_RESET' })
  yield delay(timeLeft - 60000) // 1 minute before expiry
  yield put({ type: 'SESSION_TIMEOUT_WARNING' })
  // yield call(silentTokenRefreshSaga, store) // left here for silent renew if wanted
  yield delay(1 * 60 * 1000)
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
