import * as ActionTypes from '../constants/actionTypes';
import * as ReducerTypes from '../constants/reducerTypes';
import { notifications } from '../sampleData';

export const getNotifications = () => (dispatch) => {
  dispatch(getNotificationsSuccess(notifications));
}

const getNotificationsSuccess = (notifications) => {
  return {
    name: ReducerTypes.GET_NOTIFICATIONS,
    type: ActionTypes.SUCCESS,
    data: notifications,
  }
}