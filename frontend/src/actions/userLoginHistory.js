import axios from 'axios'
import ActionTypes from '../constants/actionTypes/UserLoginHistory'
import ReducerTypes from '../constants/reducerTypes/UserLoginHistory'
import * as Routes from '../constants/routes'

const getUserLoginHistory = () => (dispatch) => {
  dispatch(getUserLoginHistoryRequest())
  axios.get(Routes.BASE_URL + Routes.USER_LOGIN_HISTORY)
    .then((response) => {
      dispatch(getUserLoginHistorySuccess(response.data))
    }).catch((error) => {
      dispatch(getUserLoginHistoryFailure(error.response))
    })
}

const getUserLoginHistoryRequest = () => ({
  name: ReducerTypes.USER_LOGIN_HISTORY,
  type: ActionTypes.GET_USER_LOGIN_HISTORY_REQUEST
})

const getUserLoginHistorySuccess = data => ({
  name: ReducerTypes.USER_LOGIN_HISTORY,
  type: ActionTypes.GET_USER_LOGIN_HISTORY_SUCCESS,
  data
})

const getUserLoginHistoryFailure = error => ({
  name: ReducerTypes.USER_LOGIN_HISTORY,
  type: ActionTypes.GET_USER_LOGIN_HISTORY_FAILURE,
  errorData: error
})

export {
  getUserLoginHistory
}
