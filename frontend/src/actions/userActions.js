import axios from 'axios';

import ActionTypes from '../constants/actionTypes/Users';
import ReducerTypes from '../constants/reducerTypes/Users';
import * as Routes from '../constants/routes';

const getUsers = () => (dispatch) => {
  dispatch(getUsersRequest());
  axios.get(Routes.BASE_URL + Routes.USERS)
    .then((response) => {
      dispatch(getUsersSuccess(response.data));
    }).catch((error) => {
      dispatch(getUsersError(error.response));
    });
};

const getLoggedInUser = () => (dispatch) => {
  dispatch(getLoggedInUserRequest());
  axios.get(Routes.BASE_URL + Routes.CURRENT_USER)
    .then((response) => {
      // localStorage.setItem('isAuthenticated', true);
      // localStorage.setItem('loggedInUser', response.data);

      dispatch(getLoggedInUserSuccess(response.data));
    }).catch((error) => {
      dispatch(getLoggedInUserError(error.response));
    });
};

const getLoggedInUserRequest = () => ({
  name: ReducerTypes.GET_LOGGED_IN_USER,
  type: ActionTypes.GET_LOGGED_IN_USER
});

const getLoggedInUserSuccess = loggedInUser => ({
  name: ReducerTypes.GET_LOGGED_IN_USER,
  type: ActionTypes.RECEIVE_LOGGED_IN_USER,
  data: loggedInUser
});

const getLoggedInUserError = error => ({
  name: ReducerTypes.GET_LOGGED_IN_USER,
  type: ActionTypes.ERROR_LOGGED_IN_USER,
  errorData: error
});

const getUser = id => (dispatch) => {
  dispatch(getUserRequest());
  axios.get(`${Routes.BASE_URL}${Routes.USERS}/${id}`)
    .then((response) => {
      dispatch(getUserSuccess(response.data));
    }).catch((error) => {
      dispatch(getUserError(error.response));
    });
};

const getUserError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_USER_REQUEST,
  type: ActionTypes.ERROR
});

const getUserRequest = () => ({
  name: ReducerTypes.GET_USER_REQUEST,
  type: ActionTypes.GET_USER
});

const getUserSuccess = user => ({
  name: ReducerTypes.RECEIVE_USER_REQUEST,
  type: ActionTypes.RECEIVE_USER,
  data: user,
  receivedAt: Date.now()
});

const getUsersRequest = () => ({
  name: ReducerTypes.GET_USERS_REQUEST,
  type: ActionTypes.GET_USERS
});

const getUsersSuccess = contacts => ({
  name: ReducerTypes.GET_USERS_REQUEST,
  type: ActionTypes.SUCCESS,
  data: contacts
});

const getUsersError = error => ({
  name: ReducerTypes.GET_USERS_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

export {
  getUsers, getLoggedInUser, getUser
};
