import {call, put, takeLatest, all} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import userManager from "./oidc-usermanager";
import {loadUser} from "redux-oidc";
import {getLoggedInUser} from "../actions/userActions";

const LOGIN_TRIGGERING_ACTIONS = [
  'redux-oidc/USER_EXPIRED'
];

function* triggerLoginFlow() {
  userManager.signinRedirect();
}

function* getBackendUser() {
  yield put(getLoggedInUser());
}

export default function* authenticationStateSaga(store) {

  loadUser(store, userManager).then((user) => {
    if (user == null && store.getState().routing.location.pathname !== '/authCallback') {
      userManager.signinRedirect();
    }
  }).catch((reason) => {
  });

  yield all([
    takeLatest('redux-oidc/USER_FOUND', getBackendUser),
    takeLatest(
      action => (LOGIN_TRIGGERING_ACTIONS.includes(action.type)),
      triggerLoginFlow
    )
  ]);
}
