import axios from 'axios';

import * as ActionTypes from '../constants/actionTypes';
import * as Routes from '../constants/routes';

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
  axios.get(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/${id}`)
    .then((response) => {
      dispatch(getCreditTransferSuccess(response.data));
    }).catch((error) => {
      dispatch(getCreditTransferError(error.response));
    });
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
  console.log('sending data', data, callback);
  axios
    .post(Routes.BASE_URL + Routes.CREDIT_TRADE_API, data)
    .then((response) => {
      console.log("success", response);
      dispatch(addCreditTransferSuccess(response.data));
      // Call the callback function if defined
      console.log("CALLING CALLBACK", callback);
      typeof callback === 'function' && callback();
    }).catch((error) => {
      console.log("error", error, error.response);
      dispatch(addCreditTransferError(error.response.data));
    });
};

const addCreditTransferRequest = () => ({
  name: 'ADD_CREDIT_TRANSFER',
  type: ActionTypes.REQUEST
});

const addCreditTransferSuccess = data => ({
  name: 'SUCCESS_ADD_CREDIT_TRANSFER',
  type: ActionTypes.SUCCESS,
  data
});

const addCreditTransferError = error => ({
  name: 'ERROR_ADD_CREDIT_TRANSFER',
  type: ActionTypes.ERROR,
  errorMessage: error
});

export const updateCreditTransfer = (data, callback) => (dispatch) => {
  dispatch(updateCreditTransferRequest());
  axios
    .post(Routes.BASE_URL + Routes.CREDIT_TRADE_API, data)
    .then((response) => {
      dispatch(updateCreditTransferSuccess(response.data));
      // Call the callback function if defined
      typeof callback === 'function' && callback();
    }).catch((error) => {
      dispatch(updateCreditTransferError(error.response.data));
    });
};

const updateCreditTransferRequest = () => ({
  name: 'UPDATE_CREDIT_TRANSFER',
  type: ActionTypes.REQUEST
});

const updateCreditTransferSuccess = data => ({
  name: 'SUCCESS_UPDATE_CREDIT_TRANSFER',
  type: ActionTypes.SUCCESS,
  data
});

const updateCreditTransferError = error => ({
  name: 'ERROR_ADD_CREDIT_TRANSFER',
  type: ActionTypes.ERROR,
  errorMessage: error
});
