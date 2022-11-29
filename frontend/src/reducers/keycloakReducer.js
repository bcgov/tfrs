import ActionTypes from '../constants/actionTypes/Keycloak'

const keycloakReducer = (state = {
  keycloak: null,
  authenticated: false,
  initialized: false,
  token: null,
  expiry: null,
  errors: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.INIT_KEYCLOAK: {
      const { keycloak, authenticated } = action.payload
      return {
        ...state,
        keycloak,
        authenticated,
        initialized: true,
        errors: {}
      }
    }
    case ActionTypes.INIT_KEYCLOAK_ERROR:
      return {
        ...state,
        initialized: true,
        authenticated: false,
        errors: action.payload
      }
    case ActionTypes.LOGOUT_KEYCLOAK_USER:
      return {
        ...state,
        token: null,
        expiry: null,
        keycloak: null,
        authenticated: false,
        initialized: false,
        errors: action.payload
      }
    case ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        expiry: action.payload.expiry,
        authenticated: true,
        errors: {}
      }
    case ActionTypes.LOGIN_KEYCLOAK_USER_ERROR:
      return {
        ...state,
        authenticated: false,
        errors: action.payload
      }
    case ActionTypes.RESET_AUTH:
      return {
        ...state,
        keycloak: null,
        authenticated: false,
        initialized: false,
        errors: {}
      }
    case ActionTypes.RESET_TOKEN:
      return {
        ...state,
        token: null,
        expiry: false,
        errors: {}
      }
    default:
      return state
  }
}

export default keycloakReducer
