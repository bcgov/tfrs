import axios from 'axios';

import ActionTypes from '../constants/actionTypes/Notifications';
import ReducerTypes from '../constants/reducerTypes/Notifications';
import * as Routes from '../constants/routes';
import NOTIFICATIONS from '../constants/routes/Notifications';

/*
 * Get Notifications
 */
const getNotifications = () => (dispatch) => {
  dispatch(getNotificationsRequest());
  return axios.get(Routes.BASE_URL + NOTIFICATIONS.API)
    .then((response) => {
      dispatch(getNotificationsSuccess(response.data));
    }).catch((error) => {
      dispatch(getNotificationsError(error.response));
    });
};

const getNotificationsRequest = () => ({
  name: ReducerTypes.GET_NOTIFICATIONS_REQUEST,
  type: ActionTypes.GET_NOTIFICATIONS
});

const getNotificationsSuccess = notifications => ({
  name: ReducerTypes.RECEIVE_NOTIFICATIONS_REQUEST,
  type: ActionTypes.RECEIVE_NOTIFICATIONS,
  data: notifications,
  receivedAt: Date.now()
});

const getNotificationsError = error => ({
  name: ReducerTypes.ERROR_NOTIFICATIONS_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Get Effective Subscriptions
 */
export const getSubscriptions = () => (dispatch) => {
  dispatch(getSubscriptionsRequest());
  return axios.get(`${Routes.BASE_URL}${NOTIFICATIONS.SUBSCRIPTIONS_API}`)
    .then((response) => {
      dispatch(getSubscriptionsSuccess(response.data));
    }).catch((error) => {
      dispatch(getSubscriptionsError(error.response));
    });
};

const getSubscriptionsRequest = () => ({
  name: ReducerTypes.GET_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.GET_SUBSCRIPTIONS
});

const getSubscriptionsSuccess = notifications => ({
  name: ReducerTypes.RECEIVE_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.RECEIVE_SUBSCRIPTIONS,
  data: notifications,
  receivedAt: Date.now()
});

const getSubscriptionsError = error => ({
  name: ReducerTypes.ERROR_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
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

const updateSubscriptionsSuccess = data => ({
  name: ReducerTypes.SUCCESS_UPDATE_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.SUCCESS,
  data
});

const updateSubscriptionsError = error => ({
  name: ReducerTypes.ERROR_UPDATE_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

export { getNotifications, updateNotificationReadStatus, updateSubscriptions };
