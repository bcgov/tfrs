import * as ActionTypes from '../constants/actionTypes';

const userRequest = (state = {
  isFetching: false,
  requestStarted: false,
  serverError: false,
  isAuthenticated: false,
  loggedInUser: {},
  error: {}
}, action) => {
  console.log('switch', action.type, action.errorData);
  switch (action.type) {
    case ActionTypes.GET_LOGGED_IN_USER:
      return Object.assign({}, state, {
        isFetching: true,
        requestStarted: true,
        isAuthenticated: false,
        loggedInUser: {}
      });
    case ActionTypes.RECEIVE_LOGGED_IN_USER:
      return Object.assign({}, state, {
        isFetching: false,
        requestStarted: true,
        isAuthenticated: true,
        loggedInUser: action.data
      });
    case ActionTypes.ERROR_LOGGED_IN_USER:
      return Object.assign({}, state, {
        isFetching: false,
        requestStarted: true,
        isAuthenticated: false,
        serverError: true,
        loggedInUser: {},
        error: action.errorData
      });
    default:
      return state;
  }
};

const usersRequest = (state = {
  items: [],
  success: false,
  error: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_CREDIT_TRANSFERS:
      return Object.assign({}, state, {
        isFetching: true,
        success: false
      });
    case ActionTypes.RECEIVE_CREDIT_TRANSFERS:
      return Object.assign({}, state, {
        isFetching: false,
        success: true,
        items: action.data
      });
    case ActionTypes.ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        success: false,
        error: action.errorData
      });
    default:
      return state;
  }
};

export { userRequest, usersRequest };
