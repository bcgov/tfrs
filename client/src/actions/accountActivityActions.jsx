import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import { activity } from '../sampleData.jsx';

export const getAccountActivity = () => (dispatch) => {
  dispatch(getAccountActivitySuccess(activity));
}

const getAccountActivitySuccess = (activity) => {
  return {
    name: ReducerTypes.GET_ACCOUNT_ACTIVITY,
    type: ActionTypes.SUCCESS,
    data: activity,
  }
}