import * as ActionTypes from '../constants/actionTypes';

const userRequest = (state = {
  error: {},
  isAuthenticated: false,
  isFetching: false,
  loggedInUser: {},
  requestStarted: false,
  serverError: false
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_LOGGED_IN_USER:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: true,
        loggedInUser: {},
        requestStarted: true
      };
    case ActionTypes.RECEIVE_LOGGED_IN_USER:
      return {
        ...state,
        isAuthenticated: true,
        isFetching: false,
        loggedInUser: {
          ...action.data,
          hasPermission: (permissionCode) => {
            if (action.data.role) {
              return action.data.role.permissions.find(permission => (
                permission.code === permissionCode
              ));
            }

            return false;
          }
        },
        requestStarted: true
      };
    case ActionTypes.ERROR_LOGGED_IN_USER:
      return {
        ...state,
        error: action.errorData,
        isAuthenticated: false,
        isFetching: false,
        loggedInUser: {},
        requestStarted: true,
        serverError: true
      };
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
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_CREDIT_TRANSFERS:
      return {
        ...state,
        isFetching: false,
        items: action.data,
        success: true
      };
    case ActionTypes.ERROR:
      return {
        ...state,
        error: action.errorData,
        isFetching: false,
        success: false
      };
    default:
      return state;
  }
};

export { userRequest, usersRequest };
