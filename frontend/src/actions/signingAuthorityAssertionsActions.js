import axios from 'axios';

import ActionTypes from '../constants/actionTypes/SigningAuthorityAssertions';
import ReducerTypes from '../constants/reducerTypes/SigningAuthorityAssertions';
import * as Routes from '../constants/routes';

const getSigningAuthorityAssertions = data => (dispatch) => {
  dispatch(getSigningAuthorityAssertionsRequest());

  return axios.get(Routes.BASE_URL + Routes.SIGNING_AUTHORITY_ASSERTIONS.LIST, { params: data })
    .then((response) => {
      dispatch(getSigningAuthorityAssertionsSuccess(response.data));
    }).catch((error) => {
      dispatch(getSigningAuthorityAssertionsError(error.response));
    });
};

const getSigningAuthorityAssertionsError = error => ({
  name: ReducerTypes.ERROR_SIGNING_AUTHORITY_ASSERTIONS_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

const getSigningAuthorityAssertionsRequest = () => ({
  name: ReducerTypes.GET_SIGNING_AUTHORITY_ASSERTIONS_REQUEST,
  type: ActionTypes.GET_SIGNING_AUTHORITY_ASSERTIONS
});

const getSigningAuthorityAssertionsSuccess = compliancePeriods => ({
  name: ReducerTypes.RECEIVE_SIGNING_AUTHORITY_ASSERTIONS_REQUEST,
  type: ActionTypes.RECEIVE_SIGNING_AUTHORITY_ASSERTIONS,
  data: compliancePeriods,
  receivedAt: Date.now()
});

export default getSigningAuthorityAssertions;
