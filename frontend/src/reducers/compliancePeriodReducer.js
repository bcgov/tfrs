import ActionTypes from '../constants/actionTypes/CompliancePeriods';

const compliancePeriods = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_COMPLIANCE_PERIODS:
      return Object.assign({}, state, {
        isFetching: true,
        success: false
      });
    case ActionTypes.RECEIVE_COMPLIANCE_PERIODS:
      return Object.assign({}, state, {
        isFetching: false,
        success: true,
        items: action.data
      });
    case ActionTypes.ERROR_COMPLIANCE_PERIODS:
      return Object.assign({}, state, {
        isFetching: false,
        success: false,
        errorMessage: action.errorMessage
      });
    default:
      return state;
  }
};

export default compliancePeriods;
