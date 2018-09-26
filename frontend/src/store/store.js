import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/reducer';
import { getNotifications } from '../actions/notificationActions';
import { SOCKETIO_URL } from '../constants/routes';

import { createUserManager, loadUser, processSilentRenew, reducer as OIDCReducer } from 'redux-oidc';
import userManager from './oidc-usermanager';
import CONFIG from '../config';
import { getLoggedInUser } from '../actions/userActions';

const middleware = routerMiddleware(history);

const loggerMiddleware = createLogger();

const socket = io(SOCKETIO_URL);
const socketIoMiddleware = createSocketIoMiddleware(socket, 'socketio/');

const store = process.env.NODE_ENV !== 'production' ? createStore(
  combineReducers({
    rootReducer,
    routing: routerReducer,
    toastr: toastrReducer,
    oidc: OIDCReducer
  }),
  applyMiddleware(
    thunk,
    loggerMiddleware,
    socketIoMiddleware,
    middleware
  )
) : createStore(
  combineReducers({
    rootReducer,
    routing: routerReducer,
    toastr: toastrReducer,
    oidc: OIDCReducer
  }),
  applyMiddleware(
    thunk,
    socketIoMiddleware,
    middleware
  )
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
