import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import axios from 'axios';
import * as Routes from '../constants/routes.jsx';

export const getUsers = () => (dispatch) => {
  dispatch(getUsersRequest());
  axios.get(Routes.BASE_URL + Routes.USERS)
  .then((response) => {
    dispatch(getUsersSuccess(response.data));
  }).catch((error) => {
    dispatch(getUsersError(error.response))
  })
}

const getUsersRequest = () => {
  return {
    name: ReducerTypes.USERS,
    type: ActionTypes.SUCCESS,
  }
}

const getUsersSuccess = (contacts) => {
  return {
    name: ReducerTypes.USERS,
    type: ActionTypes.SUCCESS,
    data: contacts,
  }
}

const getUsersError = (error) => {
  return {
    name: ReducerTypes.USERS,
    type: ActionTypes.SUCCESS,
    errorMessage: error
  }
}

