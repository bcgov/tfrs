import axios from 'axios';
import createHistory from 'history/createHashHistory';

import * as ActionTypes from '../constants/actionTypes';
import * as ReducerTypes from '../constants/reducerTypes';
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

export const getCreditTransfer = id => (dispatch) => {
  dispatch(getCreditTransferRequest());
  setTimeout(() => {
  axios.get(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/${id}`)
    .then((response) => {
      dispatch(getCreditTransferSuccess(response.data));
    }).catch((error) => {
      dispatch(getCreditTransferError(error.response));
    });
  },  5000);
};

const getCreditTransferRequest = () => ({
  name: 'GET_CREDIT_TRANSFER_REQUEST',
  type: ActionTypes.GET_CREDIT_TRANSFER
});

const getCreditTransferSuccess = creditTransfers => ({
  name: 'RECEIVE_CREDIT_TRANSFER_REQUEST',
  type: ActionTypes.RECEIVE_CREDIT_TRANSFER,
  data: creditTransfers
});

const getCreditTransferError = error => ({
  name: 'ERROR_CREDIT_TRANSFER_REQUEST',
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Add Credit Transfers
 */
export const addCreditTransfer = (data, callback) => (dispatch) => {
  dispatch(addCreditTransferRequest());
  console.log('sending data', data);
  axios
    .post(Routes.BASE_URL + Routes.CREDIT_TRADE_API, data)
    .then((response) => {
      // history.push(Routes.ACCOUNT_ACTIVITY);

      typeof callback === 'function' && callback();
      // callback();
      console.log("success", response);
      // dispatch(addCreditTransferSuccess(response.data));
    }).catch((error) => {
      console.log("error", error);
      // dispatch(addCreditTransferError(error.data));d
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
