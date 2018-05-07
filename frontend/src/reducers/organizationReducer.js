import * as ActionTypes from '../constants/actionTypes';

const organizationRequest = (state = {
  isFetching: false,
  didInvalidate: false,
  fuelSupplier: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_ORGANIZATION:
      return Object.assign({}, state, {
        isFetching: true,
        fuelSupplier: {},
        didInvalidate: false
      });
    case ActionTypes.RECEIVE_ORGANIZATION:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        fuelSupplier: action.data
      });
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
      return Object.assign({}, state, {
        isFetching: true,
        success: false
      });
    case ActionTypes.RECEIVE_ORGANIZATIONS:
      return Object.assign({}, state, {
        isFetching: false,
        success: true,
        items: action.data
      });
    case ActionTypes.ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        success: false,
        errorMessage: action.errorMessage
      });
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
      return Object.assign({}, state, {
        isFetching: true,
        success: false
      });
    case ActionTypes.RECEIVE_FUEL_SUPPLIERS:
      return Object.assign({}, state, {
        isFetching: false,
        success: true,
        fuelSuppliers: action.data
      });
    case ActionTypes.ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        success: false,
        errorMessage: action.errorMessage
      });
    default:
      return state;
  }
};

export { organizationRequest, organizations, fuelSuppliersRequest };
