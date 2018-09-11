import axios from 'axios';

import ActionTypes from '../constants/actionTypes/Notifications';
import ReducerTypes from '../constants/reducerTypes/Notifications';
import * as Routes from '../constants/routes';

const getNotifications = () => (dispatch) => {
  dispatch(getNotificationsRequest());

  axios.get(Routes.BASE_URL + Routes.NOTIFICATIONS.LIST)
    .then((response) => {
      dispatch(getNotificationsSuccess(response.data));
    }).catch((error) => {
      dispatch(getNotificationsError(error.response));
    });
};

const getNotificationsError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_NOTIFICATION_REQUEST,
  type: ActionTypes.ERROR
});

const getNotificationsRequest = () => ({
  name: ReducerTypes.GET_NOTIFICATIONS,
  type: ActionTypes.GET_NOTIFICATIONS
});

const getNotificationsSuccess = notifications => ({
  data: notifications,
  name: ReducerTypes.RECEIVE_NOTIFICATIONS_REQUEST,
  type: ActionTypes.RECEIVE_NOTIFICATIONS
});

const changeNotificationReadStatus = (id, isRead) => (dispatch) => {
  dispatch(changeNotificationStatusRequest());

  axios.put(`${Routes.BASE_URL}${Routes.NOTIFICATIONS_API}/${id}`, { isRead })
    .then((response) => {
      dispatch(changeNotificationStatusSuccess(response.data));
    }).catch((error) => {
      dispatch(changeNotificationReadStatusError(error.response));
    });
};

const changeNotificationReadStatusError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_NOTIFICATION_REQUEST,
  type: ActionTypes.ERROR
});

const changeNotificationStatusRequest = () => ({
  name: ReducerTypes.POST_CHANGE_NOTIFICATION_READ_STATUS,
  type: ActionTypes.POST_CHANGE_NOTIFICATION_READ_STATUS
});

const changeNotificationStatusSuccess = notification => ({
  data: notification,
  name: ReducerTypes.RECEIVE_CHANGE_NOTIFICATION_READ_STATUS,
  type: ActionTypes.RECEIVE_CHANGE_NOTIFICATION_READ_STATUS
});

export { getNotifications, changeNotificationReadStatus };
