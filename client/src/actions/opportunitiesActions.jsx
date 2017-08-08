import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import * as Routes from '../constants/routes.jsx';
import axios from 'axios';
import { opportunities } from '../sampleData.jsx';

export const getOpportunities = () => (dispatch) => {
  axios.post(Routes.BASE_URL + Routes.SEARCH_CREDIT_TRADES, {
  }).then((response) => {
  }).catch((error) => {
    debugger
  })
}

const getOpportunitiesSuccess = (opportunities) => {
  return {
    name: ReducerTypes.GET_OPPORTUNITIES,
    type: ActionTypes.SUCCESS,
    data: opportunities,
  }
}
