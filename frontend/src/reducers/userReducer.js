import ActionTypes from '../constants/actionTypes/Users'

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
      }
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
              )) >= 0
            }

            return false
          }
        },
        requestStarted: true
      }
    case ActionTypes.ERROR_LOGGED_IN_USER:
      return {
        ...state,
        error: action.errorData,
        isAuthenticated: false,
        isFetching: false,
        loggedInUser: {},
        requestStarted: true,
        serverError: true
      }
    default:
      return state
  }
}

const userViewRequest = (state = {
  error: {},
  isFetching: false,
  serverError: false,
  user: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_USER:
      return {
        ...state,
        isAuthenticated: false,
        isFetching: true,
        user: {}
      }
    case ActionTypes.RECEIVE_USER:
      return {
        ...state,
        isFetching: false,
        user: {
          ...action.data
        }
      }
    case ActionTypes.ERROR_USER:
      return {
        ...state,
        error: action.errorData,
        isFetching: false,
        serverError: true,
        user: {}
      }
    default:
      return state
  }
}

const userAdmin = (state = {
  error: {},
  isFetching: false,
  serverError: false,
  user: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        serverError: false,
        error: {}
      }
    case ActionTypes.CREATE_USER_REQUEST:
      return {
        ...state,
        isFetching: true,
        user: {},
        error: {}
      }
    case ActionTypes.CREATE_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        serverError: true,
        user: {
          ...action.data
        },
        error: {}
      }
    case ActionTypes.CREATE_USER_ERROR: {
      let error = {
        ...action.errorData.data
      }
      if (Object.prototype.hasOwnProperty.call(action.errorData.data, 'user')) {
        error = Object.assign(error, action.errorData.data.user)
        delete error.user
      }

      return {
        ...state,
        error,
        isFetching: false,
        serverError: true,
        user: {}
      }
    }
    case ActionTypes.UPDATE_USER_REQUEST:
      return {
        ...state,
        isFetching: true,
        user: {},
        error: {}
      }
    case ActionTypes.UPDATE_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        serverError: true,
        user: {
          ...action.data
        },
        error: {}
      }
    case ActionTypes.UPDATE_USER_ERROR:
      return {
        ...state,
        error: action.errorData.data,
        isFetching: false,
        serverError: true,
        user: {}
      }
    default:
      return state
  }
}

export { userRequest, userViewRequest, userAdmin }
