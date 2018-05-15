import axios from 'axios';

import * as Routes from '../constants/routes';

const addSigningAuthorityConfirmation = data => (dispatch) => {
  dispatch(addSigningAuthorityConfirmationRequest());

  return axios
    .post(Routes.BASE_URL + Routes.SIGNING_AUTHORITY_CONFIRMATIONS.SIGN, data)
    .then((response) => {
      dispatch(addSigningAuthorityConfirmationSuccess(response.data));
    }).catch((error) => {
      dispatch(addSigningAuthorityConfirmationError(error.response.data));
      return Promise.reject(error);
    });
};

const addSigningAuthorityConfirmationRequest = () => ({
  name: 'ADD_SIGNING_AUTHORITY_CONFIRMATION_REQUEST',
  type: 'ADD_SIGNING_AUTHORITY_CONFIRMATION'
});

const addSigningAuthorityConfirmationSuccess = data => ({
  name: 'SUCCESS_ADD_SIGNING_AUTHORITY_CONFIRMATION_SUCCESS',
  type: 'SUCCESS_ADD_SIGNING_AUTHORITY_CONFIRMATION_SUCCESS',
  data
});

const addSigningAuthorityConfirmationError = error => ({
  name: 'ERROR_ADD_SIGNING_AUTHORITY_CONFIRMATION',
  type: 'ERROR',
  errorMessage: error
});

export default addSigningAuthorityConfirmation;
