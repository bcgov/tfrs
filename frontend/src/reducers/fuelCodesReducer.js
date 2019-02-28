import ActionTypes from '../constants/actionTypes/FuelCodes';

const fuelCode = (state = {
  item: {},
  isFetching: false,
  success: false,
  errors: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_FUEL_CODE:
      return {
        ...state,
        isFetching: true,
        item: {},
        success: false
      };
    case ActionTypes.RECEIVE_FUEL_CODE:
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

const fuelCodes = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_FUEL_CODES:
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_FUEL_CODES:
      return {
        ...state,
        isFetching: false,
        items: action.data,
        success: true
      };
    case ActionTypes.ERROR:
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

export { fuelCode, fuelCodes };
