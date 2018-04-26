import * as ActionTypes from '../constants/actionTypes';

const compliancePeriods = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case 'GET_COMPLIANCE_PERIODS':
      return Object.assign({}, state, {
        isFetching: true,
        success: false
      });
    case 'RECEIVE_COMPLIANCE_PERIODS':
      return Object.assign({}, state, {
        isFetching: false,
        success: true,
        items: action.data
      });
    case 'ERROR':
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
