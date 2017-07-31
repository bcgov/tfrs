import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import { opportunities } from '../sampleData.jsx';

export const getOpportunities = () => (dispatch) => {
  dispatch(getOpportunitiesSuccess(opportunities));
}

const getOpportunitiesSuccess = (opportunities) => {
  return {
    name: ReducerTypes.GET_OPPORTUNITIES,
    type: ActionTypes.SUCCESS,
    data: opportunities,
  }
}
