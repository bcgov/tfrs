import axios from 'axios';

import ActionTypes from '../constants/actionTypes/Roles';
import ReducerTypes from '../constants/reducerTypes/Roles';
import * as Routes from '../constants/routes';

const getRoles = () => (dispatch) => {
  dispatch(getRolesRequest());

  axios.get(Routes.BASE_URL + Routes.ROLES.API)
    .then((response) => {
      dispatch(getRolesSuccess(response.data));
    }).catch((error) => {
      dispatch(getRolesError(error.response));
    });
};

const getRolesRequest = () => ({
  name: ReducerTypes.GET_ROLES_REQUEST,
  type: ActionTypes.GET_ROLES
});

const getRolesSuccess = roles => ({
  data: roles,
  name: ReducerTypes.RECEIVE_ROLES_REQUEST,
  type: ActionTypes.RECEIVE_ROLES
});

const getRolesError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_ROLES_REQUEST,
  type: ActionTypes.ERROR
});

export default getRoles;
