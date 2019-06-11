import ActionTypes from '../constants/actionTypes/CreditCalculation';

const creditCalculation = (state = {
  item: {},
  isFetching: false,
  success: false,
  errors: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_CREDIT_CALCULATION:
      return {
        ...state,
        isFetching: true,
        item: {},
        success: false
      };
    case ActionTypes.RECEIVE_CREDIT_CALCULATION:
      return {
        ...state,
        errors: {},
        isFetching: false,
        item: action.data,
        success: true
      };
    case ActionTypes.ERROR:
      return {
        ...state,
        errors: action.errorMessage,
        isFetching: false,
        success: false
      };
    default:
      return state;
  }
};

export default creditCalculation;
