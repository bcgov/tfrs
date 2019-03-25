import {call, put, takeLatest} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {getNotifications, getNotificationsCount} from "../actions/notificationActions";
import UserActionTypes from "../constants/actionTypes/Users";
import NotificationActionTypes from "../constants/actionTypes/Notifications";


const TRIGGERING_ACTIONS = [
  'SERVER_INITIATED_NOTIFICATION_RELOAD',
  UserActionTypes.RECEIVE_LOGGED_IN_USER,
  NotificationActionTypes.SUCCESS_NOTIFICATIONS
];

function* fetchNotifications(store) {
  yield call(delay, 1000); //debounce

  if (store.getState().rootReducer.userRequest.isAuthenticated) {
    yield put(getNotificationsCount());
  }

  if (store.getState().rootReducer.notifications.onNotificationsPage) {
    yield put(getNotifications());
  }

}

export default function* notificationsSaga(store) {
  yield takeLatest(
    action => (TRIGGERING_ACTIONS.includes(action.type)),
    fetchNotifications,
    store
  );
}
