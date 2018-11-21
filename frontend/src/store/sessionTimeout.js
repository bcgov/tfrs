import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { signUserOut } from '../actions/userActions';

const NON_RESETTING_ACTIONS = [
  'RECEIVE_NOTIFICATIONS',
  'SERVER_INITIATED_CONNECTION_RELOAD',
  'redux-oidc/USER_FOUND',
  'redux-oidc/USER_EXPIRING',
  'SESSION_TIMEOUT_RESET',
  'SESSION_TIMEOUT_WARNING',
  'SESSION_TIMEOUT_EXPIRED'
];

function * resetTimer () {
  yield put({ type: 'SESSION_TIMEOUT_RESET' });
  yield call(delay, 10 * 60 * 1000);
  yield put({ type: 'SESSION_TIMEOUT_WARNING' });
  yield call(delay, 3 * 60 * 1000);
  yield put({ type: 'SESSION_TIMEOUT_EXPIRED' });
  yield put(signUserOut());
}

export default function * sessionTimeoutSaga () {
  yield takeLatest(
    action => (!NON_RESETTING_ACTIONS.includes(action.type)),
    resetTimer
  );
}
