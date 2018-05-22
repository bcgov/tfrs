import axios from 'axios';

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
  name: 'GET_SIGNING_AUTHORITY_ASSERTIONS_REQUEST',
  type: 'GET_SIGNING_AUTHORITY_ASSERTIONS'
});

const getSigningAuthorityAssertionsSuccess = compliancePeriods => ({
  name: 'RECEIVE_SIGNING_AUTHORITY_ASSERTIONS_REQUEST',
  type: 'RECEIVE_SIGNING_AUTHORITY_ASSERTIONS',
  data: compliancePeriods,
  receivedAt: Date.now()
});

const getSigningAuthorityAssertionsError = error => ({
  name: 'ERROR_SIGNING_AUTHORITY_ASSERTIONS_REQUEST',
  type: 'ERROR',
  errorMessage: error
});

export default getSigningAuthorityAssertions;
