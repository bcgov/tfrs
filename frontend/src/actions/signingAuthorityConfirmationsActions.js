import axios from 'axios';

import ActionTypes from '../constants/actionTypes/SigningAuthorityConfirmations';
import * as Routes from '../constants/routes';

export const prepareSigningAuthorityConfirmations = (creditTradeId, terms) => {
  const data = [];
  terms.forEach((term) => {
    data.push({
      creditTrade: creditTradeId,
      hasAccepted: term.value,
      signingAuthorityAssertion: term.id
    });
  });

  return data;
};

export const addSigningAuthorityConfirmation = data => (dispatch) => {
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
  name: ActionTypes.ADD_SIGNING_AUTHORITY_CONFIRMATION_REQUEST,
  type: ActionTypes.ADD_SIGNING_AUTHORITY_CONFIRMATION
});

const addSigningAuthorityConfirmationSuccess = data => ({
  name: ActionTypes.SUCCESS_ADD_SIGNING_AUTHORITY_CONFIRMATION_SUCCESS,
  type: ActionTypes.SUCCESS_ADD_SIGNING_AUTHORITY_CONFIRMATION_SUCCESS,
  data
});

const addSigningAuthorityConfirmationError = error => ({
  name: ActionTypes.ERROR_ADD_SIGNING_AUTHORITY_CONFIRMATION,
  type: ActionTypes.ERROR_ADD_SIGNING_AUTHORITY_CONFIRMATION,
  errorMessage: error
});
