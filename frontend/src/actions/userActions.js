import axios from 'axios'

import ActionTypes from '../constants/actionTypes/Users'
import ReducerTypes from '../constants/reducerTypes/Users'
import * as Routes from '../constants/routes'
import { getReferenceData } from './referenceDataActions'
import { logout } from './keycloakActions'

const getUsers = () => (dispatch) => {
  dispatch(getUsersRequest())
  axios.get(Routes.BASE_URL + Routes.USERS)
    .then((response) => {
      dispatch(getUsersSuccess(response.data))
    }).catch((error) => {
      dispatch(getUsersError(error.response))
    })
}

const createUser = payload => (dispatch) => {
  console.log('createUser')
  dispatch(createUserRequest(payload))
  return axios.post(Routes.BASE_URL + Routes.USERS, payload)
    .then((response) => {
      dispatch(createUserSuccess(response.data))
    }).catch((error) => {
      dispatch(createUserError(error.response))
      throw (error)
    })
}

const updateUser = (id, payload) => (dispatch) => {
  console.log('updateUser')
  dispatch(updateUserRequest(id))
  return axios.patch(`${Routes.BASE_URL}${Routes.USERS}/${id}`, payload)
    .then((response) => {
      dispatch(updateUserSuccess(response.data))
    }).catch((error) => {
      dispatch(updateUserError(error.response))
      throw (error) // pass it up the chain
    })
}

const getLoggedInUser = () => (dispatch) => {
  dispatch(getLoggedInUserRequest())
  const url = Routes.BASE_URL + Routes.CURRENT_USER
  axios.get(url)
    .then((response) => {
      dispatch(getLoggedInUserSuccess(response.data))
    }).catch((error) => {
      console.log('getLoggedInUserError', error)
      dispatch(getLoggedInUserError(error.response))
    }).then(() => {
      dispatch(getReferenceData())
    })
}

const signUserOut = () => (dispatch) => {
  dispatch(logout())
}

const createUserRequest = payload => ({
  name: ReducerTypes.USER_ADMIN,
  type: ActionTypes.CREATE_USER_REQUEST,
  data: payload
})

const createUserSuccess = user => ({
  name: ReducerTypes.USER_ADMIN,
  type: ActionTypes.CREATE_USER_SUCCESS,
  data: user
})

const createUserError = error => ({
  name: ReducerTypes.USER_ADMIN,
  type: ActionTypes.CREATE_USER_ERROR,
  errorData: error
})

const updateUserRequest = payload => ({
  name: ReducerTypes.USER_ADMIN,
  type: ActionTypes.UPDATE_USER_REQUEST,
  data: payload
})

const updateUserSuccess = user => ({
  name: ReducerTypes.USER_ADMIN,
  type: ActionTypes.UPDATE_USER_SUCCESS,
  data: user
})

const updateUserError = error => ({
  name: ReducerTypes.USER_ADMIN,
  type: ActionTypes.UPDATE_USER_ERROR,
  errorData: error
})

const signUserOutAction = () => ({
  name: ReducerTypes.SIGN_USER_OUT,
  type: ActionTypes.SIGN_USER_OUT
})

const getLoggedInUserRequest = () => ({
  name: ReducerTypes.GET_LOGGED_IN_USER,
  type: ActionTypes.GET_LOGGED_IN_USER
})

const getLoggedInUserSuccess = loggedInUser => ({
  name: ReducerTypes.GET_LOGGED_IN_USER,
  type: ActionTypes.RECEIVE_LOGGED_IN_USER,
  data: loggedInUser
})

const getLoggedInUserError = error => ({
  name: ReducerTypes.GET_LOGGED_IN_USER,
  type: ActionTypes.ERROR_LOGGED_IN_USER,
  errorData: error
})

const getUpdatedLoggedInUser = () => (dispatch) => {
  console.log('getUpdatedLoggedInUser')
  axios.get(Routes.BASE_URL + Routes.CURRENT_USER)
    .then((response) => {
      dispatch(getLoggedInUserSuccess(response.data))
    }).catch((error) => {
      dispatch(getLoggedInUserError(error.response))
    })
}

const getUser = id => (dispatch) => {
  console.log('getUser')
  dispatch(getUserRequest())
  axios.get(`${Routes.BASE_URL}${Routes.USERS}/${id}`)
    .then((response) => {
      dispatch(getUserSuccess(response.data))
    }).catch((error) => {
      dispatch(getUserError(error.response))
    })
}

const getUserByUsername = username => (dispatch) => {
  console.log('getUserByUsername')
  dispatch(getUserRequest())
  axios.get(`${Routes.BASE_URL}${Routes.USERS}/by_username?username=${username}`)
    .then((response) => {
      dispatch(getUserSuccess(response.data))
    }).catch((error) => {
      dispatch(getUserError(error.response))
    })
}

const getUserError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_USER_REQUEST,
  type: ActionTypes.ERROR
})

const getUserRequest = () => ({
  name: ReducerTypes.GET_USER_REQUEST,
  type: ActionTypes.GET_USER
})

const getUserSuccess = user => ({
  name: ReducerTypes.RECEIVE_USER_REQUEST,
  type: ActionTypes.RECEIVE_USER,
  data: user,
  receivedAt: Date.now()
})

const getUsersRequest = () => ({
  name: ReducerTypes.GET_USERS_REQUEST,
  type: ActionTypes.GET_USERS
})

const getUsersSuccess = contacts => ({
  name: ReducerTypes.GET_USERS_REQUEST,
  type: ActionTypes.SUCCESS,
  data: contacts
})

const getUsersError = error => ({
  name: ReducerTypes.GET_USERS_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
})

const clearUsersRequestError = () => (dispatch) => {
  dispatch(clearUserErrorRequest())
}

const clearUserErrorRequest = () => ({
  name: ReducerTypes.CLEAR_ERROR_REQUEST,
  type: ActionTypes.CLEAR_ERROR
})

export {
  getUsers, getLoggedInUser, createUser, updateUser, getUser, getUserByUsername,
  signUserOut, clearUsersRequestError, getUpdatedLoggedInUser, signUserOutAction
}
