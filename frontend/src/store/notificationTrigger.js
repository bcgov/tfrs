import { put, takeLatest, delay } from 'redux-saga/effects'
import { getNotifications } from '../actions/notificationActions'
import UserActionTypes from '../constants/actionTypes/Users'
import NotificationActionTypes from '../constants/actionTypes/Notifications'

const TRIGGERING_ACTIONS = [
  'SERVER_INITIATED_NOTIFICATION_RELOAD',
  UserActionTypes.RECEIVE_LOGGED_IN_USER,
  NotificationActionTypes.SUCCESS_NOTIFICATIONS
]

// Post-login unread-count poll disabled: notifications are a historical-only
// feature, and a 500 from /api/notifications/count was tripping the global
// error reducer and locking users out of the app entirely.
function * fetchNotifications (store) {
  yield delay(1000) // debounce

  if (store.getState().rootReducer.notifications.onNotificationsPage) {
    yield put(getNotifications())
  }
}

export default function * notificationsSaga (store) {
  yield takeLatest(
    action => (TRIGGERING_ACTIONS.includes(action.type)),
    fetchNotifications,
    store
  )
}
