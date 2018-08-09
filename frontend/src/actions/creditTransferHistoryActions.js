import axios from 'axios';

import ActionTypes from '../constants/actionTypes/CreditTransactionsHistory';
import ReducerTypes from '../constants/reducerTypes/CreditTransactionsHistory';
import * as Routes from '../constants/routes';
import { CREDIT_TRANSACTIONS_HISTORY } from '../constants/routes/Admin';

/*
 * Credit Transfers History
 */
const getCreditTransfersHistory = () => (dispatch) => {
  dispatch(getCreditTransfersRequest());
  return axios.get(Routes.BASE_URL + CREDIT_TRANSACTIONS_HISTORY.API)
    .then((response) => {
      dispatch(getCreditTransfersHistorySuccess(response.data));
    }).catch((error) => {
      dispatch(getCreditTransfersHistoryError(error.response));
    });
};

const getCreditTransfersRequest = () => ({
  name: ReducerTypes.GET_CREDIT_TRANSFERS_HISTORY_REQUEST,
  type: ActionTypes.GET_CREDIT_TRANSFERS_HISTORY
});

const getCreditTransfersHistorySuccess = creditTransfers => ({
  name: ReducerTypes.RECEIVE_CREDIT_TRANSFERS_HISTORY_REQUEST,
  type: ActionTypes.RECEIVE_CREDIT_TRANSFERS_HISTORY,
  data: creditTransfers,
  receivedAt: Date.now()
});

const getCreditTransfersHistoryError = error => ({
  name: ReducerTypes.ERROR_CREDIT_TRANSFERS_HISTORY_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

export default getCreditTransfersHistory;
