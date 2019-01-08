import createSagaMiddleware from 'redux-saga';
import { createStore, compose, applyMiddleware } from 'redux';
import persistState from 'redux-localstorage';
import { createLogger } from 'redux-logger';
import { loadUser, reducer as OIDCReducer } from 'redux-oidc';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createSocketIoMiddleware from 'redux-socket.io';
import thunk from 'redux-thunk';
import { reducer as toastrReducer } from 'react-redux-toastr';
import io from 'socket.io-client';

import rootReducer from '../reducers/reducer';
import { getNotifications } from '../actions/notificationActions';
import { SOCKETIO_URL } from '../constants/routes';

import { persistTargetPathReducer } from '../reducers/persistTargetPathReducer';

import userManager from './oidc-usermanager';
import CONFIG from '../config';
import { getLoggedInUser } from '../actions/userActions';
import sessionTimeoutSaga from './sessionTimeout';
import authenticationStateSaga from "./authenticationState";
import notificationsSaga from "./notificationTrigger";

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

if (CONFIG.DEBUG.ENABLED) {
  allMiddleware.push(createLogger());
}

const store = createStore(
  combinedReducers,
  applyMiddleware(...allMiddleware),
  enhancer
);

sagaMiddleware.run(sessionTimeoutSaga);
sagaMiddleware.run(notificationsSaga, store);
sagaMiddleware.run(authenticationStateSaga, store);

export default store;
