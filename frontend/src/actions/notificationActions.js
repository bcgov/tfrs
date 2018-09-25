import axios from 'axios';

import ActionTypes from '../constants/actionTypes/Notifications';
import ReducerTypes from '../constants/reducerTypes/Notifications';
import * as Routes from '../constants/routes';
import userManager from "../store/oidc-usermanager";

/*
 * Get Notifications
 */
const getNotifications = () => (dispatch) => {
  dispatch(getNotificationsRequest());


  userManager.getUser().then((user) => {
    console.log(user);
    axios.defaults.headers.common['Authorization'] =
      'Bearer ' + user.id_token;

    axios.get(Routes.BASE_URL + Routes.NOTIFICATIONS.LIST)
      .then((response) => {
        dispatch(getNotificationsSuccess(response.data));
      }).catch((error) => {
      dispatch(getNotificationsError(error.response));
    });

  });


};

const getNotificationsError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_NOTIFICATION_REQUEST,
  type: ActionTypes.ERROR
});

const getNotificationsRequest = () => ({
  name: ReducerTypes.GET_NOTIFICATIONS_REQUEST,
  type: ActionTypes.GET_NOTIFICATIONS
});

const getNotificationsSuccess = notifications => ({
  data: notifications,
  name: ReducerTypes.RECEIVE_NOTIFICATIONS_REQUEST,
  type: ActionTypes.RECEIVE_NOTIFICATIONS
});

/*
 * Get Subscriptions
 */
const getSubscriptions = () => (dispatch) => {
  dispatch(getSubscriptionsRequest());

  axios.get(Routes.BASE_URL + Routes.NOTIFICATIONS.SUBSCRIPTIONS)
    .then((response) => {
      dispatch(getSubscriptionsSuccess(response.data));
    }).catch((error) => {
      dispatch(getSubscriptionsError(error.response));
    });
};

const getSubscriptionsError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.ERROR
});

const getSubscriptionsRequest = () => ({
  name: ReducerTypes.GET_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.GET_SUBSCRIPTIONS
});

const getSubscriptionsSuccess = notifications => ({
  data: notifications,
  name: ReducerTypes.RECEIVE_SUBSCRIPTIONS_REQUEST,
  type: ActionTypes.RECEIVE_SUBSCRIPTIONS
});

/*
 * Update Notification Read Status
 */
const updateNotifications = data => (dispatch) => {
  dispatch(updateNotificationsRequest());

  return axios.put(Routes.BASE_URL + Routes.NOTIFICATIONS.UPDATE, data)
    .then((response) => {
      dispatch(updateNotificationsSuccess(response.data));
    }).catch((error) => {
      dispatch(updateNotificationsError(error.response));
    });
};

const updateNotificationsError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_NOTIFICATION_READ_STATUS_REQUEST,
  type: ActionTypes.ERROR
});

const updateNotificationsRequest = () => ({
  name: ReducerTypes.UPDATE_NOTIFICATION_READ_STATUS_REQUEST,
  type: ActionTypes.REQUEST
});

const updateNotificationsSuccess = notification => ({
  data: notification,
  name: ReducerTypes.SUCCESS_UPDATE_NOTIFICATION_READ_STATUS_REQUEST,
  type: ActionTypes.SUCCESS_NOTIFICATIONS
});

/*
 * Update Subscriptions
 */
const updateSubscriptions = data => (dispatch) => {
  dispatch(updateSubscriptionsRequest());

  return axios
    .post(Routes.BASE_URL + Routes.NOTIFICATIONS.UPDATE_SUBSCRIPTIONS, data)
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

export { getNotifications, getSubscriptions, updateNotifications, updateSubscriptions };
