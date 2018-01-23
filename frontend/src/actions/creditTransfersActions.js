import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import * as Routes from '../constants/routes.jsx';
import axios from 'axios';

/*
 * Credit Transfers
 */
export const getCreditTransfers = () => (dispatch) => {
  dispatch(getCreditTransfersRequest());
  axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_API)
  .then((response) => {
    dispatch(getCreditTransfersSuccess(response.data));
  }).catch((error) => {
    dispatch(getCreditTransfersError(error.response))
  })
}

const getCreditTransfersRequest = () => {
  return {
    name: "GET_CREDIT_TRANSFERS_REQUEST",
    type: ActionTypes.GET_CREDIT_TRANSFERS,
  }
}

const getCreditTransfersSuccess = (creditTransfers) => {
  return {
    name: "RECEIVE_CREDIT_TRANSFERS_REQUEST",
    type: ActionTypes.RECEIVE_CREDIT_TRANSFERS,
    data: creditTransfers,
  }
}

const getCreditTransfersError = (error) => {
  return {
    name: "ERROR_CREDIT_TRANSFERS_REQUEST",
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}