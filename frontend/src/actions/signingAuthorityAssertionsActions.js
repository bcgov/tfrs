import axios from 'axios';

import ActionTypes from '../constants/actionTypes/SigningAuthorityAssertions';
import * as Routes from '../constants/routes';

const getSigningAuthorityAssertions = () => (dispatch) => {
  dispatch(getSigningAuthorityAssertionsRequest());
  return axios.get(Routes.BASE_URL + Routes.SIGNING_AUTHORITY_ASSERTIONS.LIST)
    .then((response) => {
      dispatch(getSigningAuthorityAssertionsSuccess(response.data));
    }).catch((error) => {
      dispatch(getSigningAuthorityAssertionsError(error.response));
    });
};

const getSigningAuthorityAssertionsRequest = () => ({
  name: ActionTypes.GET_SIGNING_AUTHORITY_ASSERTIONS_REQUEST,
  type: ActionTypes.GET_SIGNING_AUTHORITY_ASSERTIONS
});

const getSigningAuthorityAssertionsSuccess = compliancePeriods => ({
  name: ActionTypes.RECEIVE_SIGNING_AUTHORITY_ASSERTIONS_REQUEST,
  type: ActionTypes.RECEIVE_SIGNING_AUTHORITY_ASSERTIONS,
  data: compliancePeriods,
  receivedAt: Date.now()
});

const getSigningAuthorityAssertionsError = error => ({
  name: ActionTypes.ERROR_SIGNING_AUTHORITY_ASSERTIONS_REQUEST,
  type: ActionTypes.ERROR_SIGNING_AUTHORITY_ASSERTIONS,
  errorMessage: error
});

export default getSigningAuthorityAssertions;
