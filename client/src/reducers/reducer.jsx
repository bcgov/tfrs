import {combineReducers} from 'redux';

import * as Actions from '../constants/actionTypes.jsx';

const authenticate = ( state = {
  isFetching: false,
  didFail: false,
  user: {},
}, action) => {
  switch (action.type) {
    case Actions.REQUEST_AUTH:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case Actions.REQUEST_AUTH_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: true,
      });
    case Actions.REQUEST_AUTH_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
        user: action.user,
      });
    default:
      return state;
  }
}
const login = ( state = {
  isFetching: false,
  didFail: false,
  data: [],
}, action) => {
  switch (action.type) {
    case Actions.REQUEST_LOGIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didFail: false,
        data: action.data
      });
    case Actions.REQUEST_LOGIN_FAILURE: 
      return Object.assign({}, state, {
        isFetching: false,
        didFail: true,
      });
    case Actions.REQUEST_LOGIN:
      return Object.assign({}, state, {
        isFetching: true,
      });
    default: 
      return state;
  }
}

const rootReducer = combineReducers({
  login,
  authenticate,
})

export default rootReducer;
