import axios from 'axios';
import createHistory from 'history/createHashHistory';

import * as ActionTypes from '../constants/actionTypes';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import * as Routes from '../constants/routes';

const history = createHistory();

/*
 * Credit Transfers
 */
export const getCreditTransfers = () => (dispatch) => {
  dispatch(getCreditTransfersRequest());
  axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_API)
    .then((response) => {
      dispatch(getCreditTransfersSuccess(response.data));
    }).catch((error) => {
      dispatch(getCreditTransfersError(error.response));
    });
};

const getCreditTransfersRequest = () => ({
  name: 'GET_CREDIT_TRANSFERS_REQUEST',
  type: ActionTypes.GET_CREDIT_TRANSFERS
});

const getCreditTransfersSuccess = creditTransfers => ({
  name: 'RECEIVE_CREDIT_TRANSFERS_REQUEST',
  type: ActionTypes.RECEIVE_CREDIT_TRANSFERS,
  data: creditTransfers
});

const getCreditTransfersError = error => ({
  name: 'ERROR_CREDIT_TRANSFERS_REQUEST',
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Add Credit Transfers
 */
export const addCreditTransfer = data => (dispatch) => {
  dispatch(addCreditTransferRequest());
  console.log('sending data', data);
  axios
    .post(Routes.BASE_URL + Routes.CREDIT_TRADE_API, data)
    .then((response) => {
      history.push(Routes.ACCOUNT_ACTIVITY);
      console.log("success", response);
      // dispatch(addCreditTransferSuccess(response.data));
    }).catch((error) => {
      console.log("error", error);
      // dispatch(addCreditTransferError(error.data));
    });
};

const addCreditTransferRequest = () => ({
  name: ReducerTypes.ADD_CREDIT_TRANSFER,
  type: ActionTypes.REQUEST
});

const addCreditTransferSuccess = data => ({
  name: ReducerTypes.ADD_CREDIT_TRANSFER,
  type: ActionTypes.SUCCESS,
  data
});

const addCreditTransferError = error => ({
  name: ReducerTypes.ADD_CREDIT_TRANSFER,
  type: ActionTypes.ERROR,
  errorMessage: error
});
