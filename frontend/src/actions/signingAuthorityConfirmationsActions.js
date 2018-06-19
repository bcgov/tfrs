import axios from 'axios';

import ActionTypes from '../constants/actionTypes/SigningAuthorityConfirmations';
import ReducerTypes from '../constants/reducerTypes/SigningAuthorityConfirmations';
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

const addSigningAuthorityConfirmationError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_ADD_SIGNING_AUTHORITY_CONFIRMATION_REQUEST,
  type: ActionTypes.ERROR_ADD_SIGNING_AUTHORITY_CONFIRMATION
});

const addSigningAuthorityConfirmationRequest = () => ({
  name: ReducerTypes.ADD_SIGNING_AUTHORITY_CONFIRMATION_REQUEST,
  type: ActionTypes.ADD_SIGNING_AUTHORITY_CONFIRMATION
});

const addSigningAuthorityConfirmationSuccess = data => ({
  data,
  name: ReducerTypes.SUCCESS_ADD_SIGNING_AUTHORITY_CONFIRMATION_REQUEST,
  type: ActionTypes.SUCCESS_ADD_SIGNING_AUTHORITY_CONFIRMATION
});

const prepareSigningAuthorityConfirmations = (creditTradeId, terms) => {
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

export { addSigningAuthorityConfirmation, prepareSigningAuthorityConfirmations };
