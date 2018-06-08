import ActionTypes from '../constants/actionTypes/CompliancePeriods';

const compliancePeriods = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_COMPLIANCE_PERIODS:
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_COMPLIANCE_PERIODS:
      return {
        ...state,
        isFetching: false,
        items: action.data,
        success: true
      };
    case ActionTypes.ERROR_COMPLIANCE_PERIODS:
      return {
        ...state,
        errorMessage: action.errorMessage,
        isFetching: false,
        success: false
      };
    default:
      return state;
  }
};

export default compliancePeriods;
