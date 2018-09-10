import axios from 'axios';

import ActionTypes from '../constants/actionTypes/Notifications';
import ReducerTypes from '../constants/reducerTypes/Notifications';
import * as Routes from '../constants/routes';

/*
 * Get Notifications
 */
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

/*
 * Update Notification Read Status
 */
const updateNotificationReadStatus = (id, data) => (dispatch) => {
  dispatch(updateNotificationReadStatusRequest());

  axios.put(`${Routes.BASE_URL}${Routes.NOTIFICATIONS.API}/${id}`, data)
    .then((response) => {
      dispatch(updateNotificationReadStatusSuccess(response.data));
    }).catch((error) => {
      dispatch(updateNotificationReadStatusError(error.response));
    });
};

const updateNotificationReadStatusError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_NOTIFICATION_READ_STATUS_REQUEST,
  type: ActionTypes.ERROR
});

const updateNotificationReadStatusRequest = () => ({
  name: ReducerTypes.UPDATE_NOTIFICATION_READ_STATUS_REQUEST,
  type: ActionTypes.REQUEST
});

const updateNotificationReadStatusSuccess = notification => ({
  data: notification,
  name: ReducerTypes.SUCCESS_UPDATE_NOTIFICATION_READ_STATUS_REQUEST,
  type: ActionTypes.SUCCESS
});

/*
 * Update Subscriptions
 */
const updateSubscriptions = data => (dispatch) => {
  dispatch(updateSubscriptionsRequest());

  return axios
    .put(`${Routes.BASE_URL}${Routes.SUBSCRIPTIONS_API}`, data)
    .then((response) => {
      dispatch(updateSubscriptionsSuccess(response.data));
      return Promise.resolve(response);
    }).catch((error) => {
      dispatch(updateSubscriptionsError(error.response.data));
      return Promise.reject(error);
    });
};

const updateSubscriptionsRequest = () => ({
  name: ReducerTypes.UPDATE_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.REQUEST
});

const updateSubscriptionsSuccess = notification => ({
  data: notification,
  name: ReducerTypes.SUCCESS_UPDATE_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.SUCCESS
});

const updateSubscriptionsError = error => ({
  name: ReducerTypes.ERROR_UPDATE_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

export { getNotifications, updateNotificationReadStatus, updateSubscriptions };
