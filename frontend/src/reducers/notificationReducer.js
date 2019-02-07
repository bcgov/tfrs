import ActionTypes from '../constants/actionTypes/Notifications';

const notifications = (state = {
  errorMessage: [],
  isFetching: false,
  items: [],
  serverInitiatedReloadRequested: false,
  success: false
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_NOTIFICATIONS:
      return {
        ...state,
        isFetching: true,
        serverInitiatedReloadRequested: false,
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
    case ActionTypes.SERVER_INITIATED_NOTIFICATION_RELOAD:
      return {
        ...state,
        serverInitiatedReloadRequested: true
      };
    case ActionTypes.SUCCESS_NOTIFICATIONS:
      return {
        ...state,
        didInvalidate: true,
        isFetching: false,
        items: state.items.map(notification => (
          action.data.find(updated => ( // refresh the fields of the items displayed
            updated.id === notification.id
          )) || notification
        )).filter(notification => (!notification.isArchived)), // only show unarchived
        message: action.message,
        success: true
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
        errorMessage: [],
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
