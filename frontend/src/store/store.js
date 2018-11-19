import { applyMiddleware, compose, createStore } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import io from 'socket.io-client';
import thunk from 'redux-thunk';

import { loadUser, reducer as OIDCReducer } from 'redux-oidc';

import persistState from 'redux-localstorage';
import createSocketIoMiddleware from 'redux-socket.io';
import createSagaMiddleware from 'redux-saga';

import rootReducer from '../reducers/reducer';
import { getNotifications } from '../actions/notificationActions';
import { SOCKETIO_URL } from '../constants/routes';

import { persistTargetPathReducer } from '../reducers/persistTargetPathReducer';

import userManager from './oidc-usermanager';
import CONFIG from '../config';
import { getLoggedInUser } from '../actions/userActions';
import sessionTimeoutSaga from "./sessionTimeout";

const middleware = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();

const socket = io(SOCKETIO_URL);
const socketIoMiddleware = createSocketIoMiddleware(socket, 'socketio/');

const enhancer = compose(persistState(['targetPath'], { key: 'tfrs-state' }));

const combinedReducers = (state = {}, action) => {
  const currentRoute = state.routing || {};
  return {
    toastr: toastrReducer(state.toastr, action),
    oidc: OIDCReducer(state.oidc, action),
    routing: routerReducer(state.routing, action),
    targetPath: persistTargetPathReducer(state.targetPath, { ...action, currentRoute }),
    rootReducer: rootReducer(state.rootReducer, action)
  };
};

const allMiddleware = [
  thunk,
  socketIoMiddleware,
  sagaMiddleware,
  middleware
];

if (process.env.NODE_ENV !== 'production') {
  allMiddleware.push(createLogger());
}

const store = createStore(
  combinedReducers,
  applyMiddleware(...allMiddleware),
  enhancer
);

let subscriptionProcessing = false;

store.subscribe(() => {
  const state = store.getState();
  if (!subscriptionProcessing) {
    subscriptionProcessing = true;

    if (state.rootReducer.notifications.serverInitiatedReloadRequested === true) {
      store.dispatch(getNotifications());
    }

    if (CONFIG.KEYCLOAK.ENABLED) {
      if (state.oidc.user && !state.oidc.user.expired &&
        !state.rootReducer.userRequest.isFetching &&
        !state.rootReducer.userRequest.isAuthenticated &&
        !state.rootReducer.userRequest.serverError) {
        store.dispatch(getLoggedInUser());
      }
    }

    subscriptionProcessing = false;
  }
});

sagaMiddleware.run(sessionTimeoutSaga);

if (CONFIG.KEYCLOAK.ENABLED) {
  loadUser(store, userManager);
}

export default store;
