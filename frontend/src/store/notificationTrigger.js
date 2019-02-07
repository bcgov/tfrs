import {call, put, takeLatest} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {signUserOut} from '../actions/userActions';
import {getNotifications} from "../actions/notificationActions";

const TRIGGERING_ACTIONS = [
  'SERVER_INITIATED_NOTIFICATION_RELOAD',
];

function* fetchNotifications(store) {
  yield call(delay, 250); //debounce

  if (store.getState().rootReducer.userRequest.isAuthenticated) {
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
