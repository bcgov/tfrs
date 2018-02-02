import * as ActionTypes from '../constants/actionTypes';

const creditTransfer = (state = {
  isFetching: false,
  didInvalidate: false,
  item: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_CREDIT_TRANSFER:
      return [
        ...state,
        Object.assign({}, action.data)];
    case ActionTypes.UPDATE_CREDIT_TRANSFER:
      return [
        ...state,
        Object.assign({}, action.data)];
    case ActionTypes.DELETE_REQUEST_ITEM:
      return [
        ...state,
        Object.assign({}, action.data)];
    case ActionTypes.GET_CREDIT_TRANSFER:
      return Object.assign({}, state, {
        isFetching: true,
        item: {},
        didInvalidate: false
      });
    case ActionTypes.RECEIVE_CREDIT_TRANSFER:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        item: action.data
      });
    default:
      return state;
  }
};

const creditTransfers = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_CREDIT_TRANSFERS:
      return Object.assign({}, state, {
        isFetching: true,
        success: false
      });
    case ActionTypes.RECEIVE_CREDIT_TRANSFERS:
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

export { creditTransfer, creditTransfers };
