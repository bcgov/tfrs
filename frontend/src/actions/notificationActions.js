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

export default getNotifications;
