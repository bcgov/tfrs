import ActionTypes from '../constants/actionTypes/UserLoginHistory'

const initialState = {
  error: {},
  isFetching: false,
  items: []
}

const userLoginHistory = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_USER_LOGIN_HISTORY_REQUEST:
      return {
        ...state,
        isFetching: true
      }
    case ActionTypes.GET_USER_LOGIN_HISTORY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.data
      }
    case ActionTypes.GET_USER_LOGIN_HISTORY_FAILURE:
      return {
        ...state,
        error: action.errorData,
        isFetching: false
      }
    default:
      return state
  }
}

export default userLoginHistory
