import ActionTypes from '../constants/actionTypes/CreditTransfers';

const creditTransfer = (state = {
  isFetching: false,
  didInvalidate: false,
  item: {},
  errors: {}
}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_CREDIT_TRANSFER:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        item: action.data
      };
    case ActionTypes.SUCCESS_ADD_CREDIT_TRANSFER:
      return {
        ...state,
        isFetching: false,
        didInvalidate: true,
        item: {} // action.data
      };
    case ActionTypes.UPDATE_CREDIT_TRANSFER:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        item: action.data
      };
    case ActionTypes.DELETE_REQUEST_ITEM:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        item: action.data
      };
    case ActionTypes.GET_CREDIT_TRANSFER:
      return {
        ...state,
        isFetching: true,
        item: {},
        didInvalidate: false
      };
    case ActionTypes.RECEIVE_CREDIT_TRANSFER:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        item: action.data
      };
    case ActionTypes.ERROR:
      return {
        ...state,
        didInvalidate: true,
        isFetching: false,
        errors: action.errorMessage,
        fields: action.data
      };
    case ActionTypes.INVALIDATE_CREDIT_TRANSFER:
      return {
        ...state,
        didInvalidate: true,
        errors: {},
        message: ''
      };
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
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_CREDIT_TRANSFERS:
      return {
        ...state,
        isFetching: false,
        success: true,
        items: action.data
      };
    case ActionTypes.COMMIT_ERRORS:
      return {
        ...state,
        didInvalidate: true,
        isFetching: false,
        success: false,
        errors: action.errorMessage
      };
    case ActionTypes.ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        errorMessage: action.errorMessage
      };
    case ActionTypes.INVALIDATE_CREDIT_TRANSFERS:
      return {
        ...state,
        didInvalidate: true,
        errors: {},
        message: ''
      };
    case ActionTypes.SUCCESS:
      return {
        ...state,
        didInvalidate: true,
        isFetching: false,
        success: true,
        message: action.message
      };
    default:
      return state;
  }
};

const approvedCreditTransfers = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_CREDIT_TRANSFERS:
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_APPROVED_CREDIT_TRANSFERS:
      return {
        ...state,
        isFetching: false,
        items: action.data,
        success: true
      };
    case ActionTypes.COMMIT_ERRORS:
      return {
        ...state,
        didInvalidate: true,
        errors: action.errorMessage,
        isFetching: false,
        success: false
      };
    case ActionTypes.ERROR:
      return {
        ...state,
        errorMessage: action.errorMessage,
        isFetching: false,
        success: false
      };
    case ActionTypes.INVALIDATE_CREDIT_TRANSFERS:
      return {
        ...state,
        didInvalidate: true,
        errors: {},
        message: ''
      };
    case ActionTypes.SUCCESS:
      return {
        ...state,
        didInvalidate: true,
        isFetching: false,
        message: action.message,
        success: true
      };
    default:
      return state;
  }
};

export { approvedCreditTransfers, creditTransfer, creditTransfers };
