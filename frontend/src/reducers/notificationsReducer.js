import ActionTypes from '../constants/actionTypes/Notifications';

const notificationsReducer = (state = {
  notifications: [],
  fetching: false,
  success: true,
  serverInitiatedReloadRequested: false
}, action) => {
  switch (action.type) {
    case ActionTypes.SERVER_INITIATED_NOTIFICATION_RELOAD:
      return {
        ...state,
        serverInitiatedReloadRequested: true
      };

    case ActionTypes.GET_NOTIFICATIONS:
      return {
        ...state,
        fetching: true,
        success: false,
        serverInitiatedReloadRequested: false
      };
    case ActionTypes.RECEIVE_NOTIFICATIONS:
      return {
        ...state,
        fetching: false,
        notifications: action.data,
        success: true
      };
    case ActionTypes.ERROR:
      return {
        ...state,
        errorMessage: action.errorMessage,
        fetching: false,
        success: false
      };
    default:
      return state;
  }
};

export default notificationsReducer;
