import { loadUser } from 'redux-oidc';
import { put, takeLatest, all } from 'redux-saga/effects';
import userManager from './oidc-usermanager';
import { getLoggedInUser } from '../actions/userActions';
import CONFIG from '../config';

const LOGIN_TRIGGERING_ACTIONS = [
  'redux-oidc/USER_EXPIRED'
];

function triggerLoginFlow (store) {
  const { routing } = store.getState();

  if (routing.location &&
    routing.location.pathname !== '/authCallback') {
    return CONFIG.KEYCLOAK.CUSTOM_LOGIN
      ? userManager.signinSilent().catch((e) => {
        // catch the login_required error so we don't see them in the console
      })
      : userManager.signinRedirect();
  }

  return false;
}

function * getBackendUser (store) {
  const { rootReducer } = store.getState();
  if (!rootReducer.userRequest.isAuthenticated) {
    yield put(getLoggedInUser());
  }
}

export default function * authenticationStateSaga (store) {
  userManager.clearStaleState();

  const { routing } = store.getState();

  if (!routing.location || routing.location.pathname !== '/authCallback') {
    loadUser(store, userManager);
  }

  yield all([
    takeLatest('redux-oidc/USER_FOUND', getBackendUser, store),
    takeLatest(
      action => (LOGIN_TRIGGERING_ACTIONS.includes(action.type)),
      triggerLoginFlow,
      store
    )
  ]);
}
