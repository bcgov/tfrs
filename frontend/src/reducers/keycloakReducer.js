import ActionTypes from '../constants/actionTypes/Keycloak'

const keycloakReducer = (state = {
  keycloak: null,
  authenticated: false,
  token: null,
  expiry: null,
  isFetching: false,
  success: false,
  errors: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.INIT_KEYCLOAK: {
      const { keycloak, authenticated } = action.payload
      return {
        ...state,
        keycloak,
        authenticated,
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
        token: null,
        expiry: null,
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
    default:
      return state
  }
}

export default keycloakReducer
