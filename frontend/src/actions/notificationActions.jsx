import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import { notifications } from '../sampleData.jsx';

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