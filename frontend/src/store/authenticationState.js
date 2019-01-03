import { loadUser } from 'redux-oidc';
import { call, put, takeLatest, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import userManager from './oidc-usermanager';
import { getLoggedInUser } from '../actions/userActions';


const LOGIN_TRIGGERING_ACTIONS = [
  'redux-oidc/USER_EXPIRED'
];

function* triggerLoginFlow (store) {
  const routing = store.getState().routing;

  if (routing.location &&
    routing.location.pathname !== '/authCallback') {
    return userManager.signinRedirect();
  }
}

function* getBackendUser () {
  yield put(getLoggedInUser());
}

export default function* authenticationStateSaga (store) {

  userManager.clearStaleState();

  const routing = store.getState().routing;

  if (!routing.location || routing.location.pathname !== '/authCallback') {
    loadUser(store, userManager).then((user) => {
      // no action required
    }).catch((reason) => {
    });
  }
  yield all([
    takeLatest('redux-oidc/USER_FOUND', getBackendUser),
    takeLatest(
      action => (LOGIN_TRIGGERING_ACTIONS.includes(action.type)),
      triggerLoginFlow,
      store
    )
  ]);
}
