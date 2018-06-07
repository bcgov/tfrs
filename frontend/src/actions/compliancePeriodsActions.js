import axios from 'axios';

import ActionTypes from '../constants/actionTypes/CompliancePeriods';
import * as Routes from '../constants/routes';

const getCompliancePeriods = () => (dispatch) => {
  dispatch(getCompliancePeriodsRequest());
  return axios.get(Routes.BASE_URL + Routes.COMPLIANCE_PERIODS.LIST)
    .then((response) => {
      dispatch(getCompliancePeriodsSuccess(response.data));
    }).catch((error) => {
      dispatch(getCompliancePeriodsError(error.response));
    });
};

const getCompliancePeriodsRequest = () => ({
  name: ActionTypes.GET_COMPLIANCE_PERIODS_REQUEST,
  type: ActionTypes.GET_COMPLIANCE_PERIODS
});

const getCompliancePeriodsSuccess = compliancePeriods => ({
  name: ActionTypes.RECEIVE_COMPLIANCE_PERIODS_REQUEST,
  type: ActionTypes.RECEIVE_COMPLIANCE_PERIODS,
  data: compliancePeriods,
  receivedAt: Date.now()
});

const getCompliancePeriodsError = error => ({
  name: ActionTypes.ERROR_COMPLIANCE_PERIODS_REQUEST,
  type: ActionTypes.ERROR_COMPLIANCE_PERIODS,
  errorMessage: error
});

export default getCompliancePeriods;
