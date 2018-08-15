import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/reducer';

const middleware = routerMiddleware(history);
const loggerMiddleware = createLogger();

const store = process.env.NODE_ENV !== 'production' ? createStore(
  combineReducers({
    rootReducer,
    routing: routerReducer,
    toastr: toastrReducer
  }),
  applyMiddleware(
    thunk,
    loggerMiddleware,
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
    middleware
  )
);

export default store;
