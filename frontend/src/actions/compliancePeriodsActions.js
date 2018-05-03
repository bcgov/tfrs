import axios from 'axios';

import * as ActionTypes from '../constants/actionTypes';
import * as Routes from '../constants/routes';

/*
 * Credit Transfers
 */
const getCompliancePeriods = () => (dispatch) => {
  dispatch(getCompliancePeriodsRequest());
  return axios.get(Routes.BASE_URL + Routes.COMPLIANCE_PERIODS)
    .then((response) => {
      dispatch(getCompliancePeriodsSuccess(response.data));
    }).catch((error) => {
      dispatch(getCompliancePeriodsError(error.response));
    });
};

const getCompliancePeriodsRequest = () => ({
  name: 'GET_COMPLIANCE_PERIODS_REQUEST',
  type: 'GET_COMPLIANCE_PERIODS'
});

const getCompliancePeriodsSuccess = compliancePeriods => ({
  name: 'RECEIVE_COMPLIANCE_PERIODS_REQUEST',
  type: 'RECEIVE_COMPLIANCE_PERIODS',
  data: compliancePeriods,
  receivedAt: Date.now()
});

const getCompliancePeriodsError = error => ({
  name: 'ERROR_COMPLIANCE_PERIODS_REQUEST',
  type: 'ERROR',
  errorMessage: error
});

export default getCompliancePeriods;
