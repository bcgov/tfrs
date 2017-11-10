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
    type: ActionTypes.REQUEST,
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
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getPermissions = () => (dispatch) => {
  dispatch(getPermissionsRequest());
  axios.get(Routes.BASE_URL + Routes.PERMISSIONS)
  .then((response) => {
    dispatch(getPermissionsSuccess(response.data));
  }).catch((error) => {
    dispatch(getPermissionsError(error.response))
  })
}

const getPermissionsRequest = () => {
  return {
    name: ReducerTypes.PERMISSIONS,
    type: ActionTypes.REQUEST,
  }
}

const getPermissionsSuccess = (permissions) => {
  return {
    name: ReducerTypes.PERMISSIONS,
    type: ActionTypes.SUCCESS,
    data: contacts,
  }
}

const getPermissionsError = (error) => {
  return {
    name: ReducerTypes.PERMISSIONS,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getRolePermissions = () => (dispatch) => {
  dispatch(getRolePermissionsRequest());
  axios.get(Routes.BASE_URL + Routes.ROLE_PERMISSIONS)
  .then((response) => {
    dispatch(getRolePermissionsSuccess(response.data));
  }).catch((error) => {
    dispatch(getRolePermissionsError(error.response))
  })
}

const getRolePermissionsRequest = () => {
  return {
    name: ReducerTypes.ROLE_PERMISSIONS,
    type: ActionTypes.REQUEST,
  }
}

const getRolePermissionsSuccess = (rolePermissions) => {
  return {
    name: ReducerTypes.ROLE_PERMISSIONS,
    type: ActionTypes.SUCCESS,
    data: rolePermissions,
  }
}

const getRolePermissionsError = (error) => {
  return {
    name: ReducerTypes.ROLE_PERMISSIONS,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getRoles = () => (dispatch) => {
  dispatch(getRolesRequest());
  axios.get(Routes.BASE_URL + Routes.ROLES)
  .then((response) => {
    dispatch(getRolesSuccess(response.data));
  }).catch((error) => {
    dispatch(getRolesError(error.response))
  })
}

const getRolesRequest = () => {
  return {
    name: ReducerTypes.ROLES,
    type: ActionTypes.REQUEST,
  }
}

const getRolesSuccess = (roles) => {
  return {
    name: ReducerTypes.ROLES,
    type: ActionTypes.SUCCESS,
    data: roles,
  }
}

const getRolesError = (error) => {
  return {
    name: ReducerTypes.ROLES,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getUserRoles = () => (dispatch) => {
  dispatch(getUserRolesRequest());
  axios.get(Routes.BASE_URL + Routes.USER_ROLES)
  .then((response) => {
    dispatch(getUserRolesSuccess(response.data));
  }).catch((error) => {
    dispatch(getUserRolesError(error.response))
  })
}

const getUserRolesRequest = () => {
  return {
    name: ReducerTypes.USER_ROLES,
    type: ActionTypes.REQUEST,
  }
}

const getUserRolesSuccess = (userRoles) => {
  return {
    name: ReducerTypes.USER_ROLES,
    type: ActionTypes.SUCCESS,
    data: userRoles,
  }
}

const getUserRolesError = (error) => {
  return {
    name: ReducerTypes.USER_ROLES,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}
