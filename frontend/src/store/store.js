import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import io from 'socket.io-client';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/reducer';
import { getNotifications } from '../actions/notificationActions';
import { SOCKETIO_URL } from '../constants/routes';

import createOidcMiddleware, { loadUser, processSilentRenew, reducer as OIDCReducer } from 'redux-oidc';
import { persistTargetPathReducer } from '../reducers/persistTargetPathReducer';

import userManager from './oidc-usermanager';
import CONFIG from '../config';
import { getLoggedInUser } from '../actions/userActions';

import persistState from 'redux-localstorage';
import createSocketIoMiddleware from 'redux-socket.io';

const middleware = routerMiddleware(history);
const oidcMiddleware = createOidcMiddleware(userManager);

const socket = io(SOCKETIO_URL);
const socketIoMiddleware = createSocketIoMiddleware(socket, 'socketio/');

const enhancer = compose(persistState(['targetPath'], {key: 'tfrs-state'}));

const combinedReducers = (state = {}, action) => {
  const currentRoute = state.routing || {};
  return {
    toastr: toastrReducer(state.toastr, action),
    oidc: OIDCReducer(state.oidc, action),
    routing: routerReducer(state.routing, action),
    targetPath: persistTargetPathReducer(state.targetPath, {...action, currentRoute}),
    rootReducer: rootReducer(state.rootReducer, action),
  };
};

let allMiddleware = [
  thunk,
  socketIoMiddleware,
  oidcMiddleware,
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
      if (state.oidc.user &&
        !state.rootReducer.userRequest.isFetching &&
        !state.rootReducer.userRequest.isAuthenticated) {
        store.dispatch(getLoggedInUser());
      }
    }

    subscriptionProcessing = false;
  }
});

if (CONFIG.KEYCLOAK.ENABLED) {
  loadUser(store, userManager);
  processSilentRenew();
}

export default store;
