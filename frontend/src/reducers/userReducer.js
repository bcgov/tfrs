import ActionTypes from '../constants/actionTypes/Users';

const userRequest = (state = {
  error: {},
  isAuthenticated: false,
  isFetching: false,
  loggedInUser: {},
  requestStarted: false,
  serverError: false,
  user: {}
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
            if (action.data.permissions) {
              return action.data.permissions.findIndex(permission => (
                permission.code === permissionCode
              )) >= 0;
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

const userViewRequest = (state = {
  error: {},
  isFetching: false,
  serverError: false,
  user: {}
}, action) => {
  switch (action.type) {
    // case "redux-oidc/USER_FOUND":
    //   return {
    //     ...state,
    //     oidcUser: {...action.data, hasPermission: (code) => { return true; }}
    //   };
    case ActionTypes.GET_USER:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: true,
        user: {}
      };
    case ActionTypes.RECEIVE_USER:
      return {
        ...state,
        isFetching: false,
        user: {
          ...action.data
        }
      };
    case ActionTypes.ERROR_USER:
      return {
        ...state,
        error: action.errorData,
        isFetching: false,
        serverError: true,
        user: {}
      };
    default:
      return state;
  }
};

export { userRequest, userViewRequest };
