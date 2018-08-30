import ActionTypes from '../constants/actionTypes/Notifications';

const notifications = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_NOTIFICATIONS:
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_NOTIFICATIONS:
      return {
        ...state,
        isFetching: false,
        success: true,
        items: action.data
      };
    case ActionTypes.ERROR:
      return {
        ...state,
        isFetching: false,
        success: false,
        errorMessage: action.errorMessage
      };
    case ActionTypes.INVALIDATE_NOTIFICATIONS:
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

const subscriptions = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_SUBSCRIPTIONS:
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_SUBSCRIPTIONS:
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
    case ActionTypes.INVALIDATE_SUBSCRIPTIONS:
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

export { notifications, subscriptions };
