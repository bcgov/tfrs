import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';

import * as Actions from '../constants/actionTypes.jsx';


const requestLogin = () => {
  return {
    type: Actions.REQUEST_LOGIN,
  }
}

const requestLoginSuccess = json => {
  return {
    type: Actions.REQUEST_LOGIN_SUCCESS,
    data: json
  }
}

const requestLoginFailure = () => {
  return {
    type: Actions.REQUEST_LOGIN_FAILURE,
  }
}

const requestAuth = () => {
  return {
    type: Actions.REQUEST_AUTH
  }
}

const requestAuthFailure = () => {
  return {
    type: Actions.REQUEST_AUTH_FAILURE
  }
}

const requestAuthSuccess = (user) => {
  return {
    type: Actions.REQUEST_AUTH_SUCCESS,
    data: user
  }
}

export const login = (email, password) => dispatch => {
  //loading done here
  // to push to new areas -> dispatch(push('/login'));
  dispatch(requestLogin());
  dispatch(requestLoginSuccess());
}

export const authStateChanged = (user) => dispatch => {
  dispatch(requestAuth());
  dispatch(requestAuthSuccess(user));
}

