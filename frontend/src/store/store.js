import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/reducer';

const middleware = routerMiddleware(history);

const loggerMiddleware = createLogger();



const socket = io('http://localhost:3000');
const socketIoMiddleware = createSocketIoMiddleware(socket, 'socketio/');


const store = process.env.NODE_ENV !== 'production' ? createStore(
  combineReducers({
    rootReducer,
    routing: routerReducer,
    toastr: toastrReducer
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
    toastr: toastrReducer
  }),
  applyMiddleware(
    thunk,
    socketIoMiddleware,
    middleware
  )
);

export default store;
