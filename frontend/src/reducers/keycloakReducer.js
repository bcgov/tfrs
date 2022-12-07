import ActionTypes from '../constants/actionTypes/Keycloak'

const keycloakReducer = (state = {
  keycloak: null,
  authenticated: false,
  idToken: null,
  refreshToken: null,
  loggingIn: false,
  expiry: null,
  errors: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.INIT_KEYCLOAK: {
      const { keycloak } = action.payload
      return {
        ...state,
        keycloak,
        authenticated: keycloak.authenticated,
        errors: {}
      }
    }
    case ActionTypes.INIT_KEYCLOAK_ERROR:
      return {
        ...state,
        authenticated: false,
        errors: action.payload
      }
    case ActionTypes.LOGOUT_KEYCLOAK_USER:
      return {
        ...state,
        idToken: null,
        refreshToken: null,
        expiry: null,
        keycloak: null,
        authenticated: false,
        errors: action.payload
      }
    case ActionTypes.LOGGING_IN:
      return {
        ...state,
        loggingIn: true,
        errors: {}
      }
    case ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS:
      return {
        ...state,
        idToken: action.payload.idToken,
        refreshToken: action.payload.refreshToken,
        expiry: action.payload.expiry,
        authenticated: true,
        loggingIn: false,
        errors: {}
      }
    case ActionTypes.LOGIN_KEYCLOAK_REFRESH_SUCCESS:
      return {
        ...state,
        refreshToken: action.payload.refreshToken,
        expiry: action.payload.expiry,
        authenticated: true,
        loggingIn: false,
        errors: {}
      }
    case ActionTypes.LOGIN_KEYCLOAK_SILENT_REFRESH_SUCCESS:
      return {
        ...state,
        idToken: action.payload.idToken,
        refreshToken: action.payload.refreshToken,
        expiry: action.payload.expiry,
        authenticated: true,
        loggingIn: false,
        errors: {}
      }
    case ActionTypes.LOGIN_KEYCLOAK_USER_ERROR:
      return {
        ...state,
        authenticated: false,
        loggingIn: false,
        errors: action.payload
      }
    case ActionTypes.RESET_AUTH:
      return {
        ...state,
        keycloak: null,
        authenticated: false,
        errors: {}
      }
    case ActionTypes.RESET_TOKEN:
      return {
        ...state,
        idToken: null,
        refreshToken: null,
        expiry: false,
        errors: {}
      }
    default:
      return state
  }
}

export default keycloakReducer
