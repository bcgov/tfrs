import ActionTypes from '../constants/actionTypes/Organizations';

const organizationRequest = (state = {
  didInvalidate: false,
  fuelSupplier: {},
  isFetching: false
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_ORGANIZATION:
      return {
        ...state,
        didInvalidate: false,
        fuelSupplier: {},
        isFetching: true
      };
    case ActionTypes.RECEIVE_ORGANIZATION:
      return {
        ...state,
        didInvalidate: false,
        fuelSupplier: action.data,
        isFetching: false
      };
    default:
      return state;
  }
};

const organizations = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_ORGANIZATIONS:
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_ORGANIZATIONS:
      return {
        ...state,
        isFetching: false,
        items: action.data,
        success: true
      };
    case ActionTypes.ERROR_ORGANIZATIONS:
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

const fuelSuppliersRequest = (state = {
  fuelSuppliers: [],
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_FUEL_SUPPLIERS:
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_FUEL_SUPPLIERS:
      return {
        ...state,
        fuelSuppliers: action.data,
        isFetching: false,
        success: true
      };
    case ActionTypes.ERROR_FUEL_SUPPLIERS:
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

export { organizationRequest, organizations, fuelSuppliersRequest };
