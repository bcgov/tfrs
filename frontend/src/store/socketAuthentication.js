import {put, takeLatest, all} from 'redux-saga/effects';
import userManager from './oidc-usermanager';

function socketAuthenticate(dispatch) {

  userManager.getUser().then(user => {

    if (!user || !user.id_token)
      return;

    dispatch(
      {
        type: "socketio/AUTHENTICATE",
        token: user.id_token
      }
    );
  });
}


function* socketDeauthenticate() {3
  yield put({
    type: "socketio/DEAUTHENTICATE",
  });
}

export default function* socketAuthenticationSaga(store) {
  yield all([
    takeLatest('redux-oidc/USER_FOUND', socketAuthenticate, store.dispatch),
    takeLatest('redux-oidc/USER_EXPIRED', socketDeauthenticate)
  ]);
}
