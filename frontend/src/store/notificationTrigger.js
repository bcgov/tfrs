import {call, put, takeLatest} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {getNotificationsCount} from "../actions/notificationActions";
import ActionTypes from "../constants/actionTypes/Users";

const TRIGGERING_ACTIONS = [
  'SERVER_INITIATED_NOTIFICATION_RELOAD',
  ActionTypes.RECEIVE_LOGGED_IN_USER
];

function* fetchNotifications(store) {
  yield call(delay, 250); //debounce

  if (store.getState().rootReducer.userRequest.isAuthenticated) {
    yield put(getNotificationsCount());
  }
}

export default function* notificationsSaga(store) {
  yield takeLatest(
    action => (TRIGGERING_ACTIONS.includes(action.type)),
    fetchNotifications,
    store
  );
}
