import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import * as Routes from '../constants/routes.jsx';
import axios from 'axios';
import { activity } from '../sampleData.jsx';
import { CreditTransfer } from '../sampleData.jsx';

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

export const acceptCreditTransfer = (id, note) => (dispatch) => {
  dispatch(acceptCreditTransferSuccess());
}

const acceptCreditTransferSuccess = () => {
  return {
    name: ReducerTypes.ACCEPT_CREDIT_TRANSFER,
    type: ActionTypes.SUCCESS,
  }
}

export const acceptCreditTransferReset = () => {
  return {
    name: ReducerTypes.ACCEPT_CREDIT_TRANSFER,
    type: ActionTypes.RESET,
  }
}

export const getCreditTransfer = (id) => (dispatch) => {
  dispatch(getCreditTransferSuccess(CreditTransfer));
}

const getCreditTransferSuccess = (data) => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFER,
    type: ActionTypes.SUCCESS,
    data: data
  }
}

export const getCreditTransferReset = () => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFER,
    type: ActionTypes.RESET,
  }
}

export const getCreditTransfers = () => (dispatch) => {
  debugger;
  axios.post(Routes.BASE_URL + Routes.SEARCH_CREDIT_TRADES, {
  }).then((response) => {
    debugger;
  }).catch((error) => {
    debugger;
  })
}

const getCreditTransfersSuccess = (data) => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFERS,
    type: ActionTypes.SUCCESS,
    data: data
  }
}

export const getCreditTransfersReset = () => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFERS,
    type: ActionTypes.RESET,
  }
}

export const addCreditTransfer = (data) => (dispatch) => {
  console.log(data);
  debugger;
  axios.post(Routes.BASE_URL + Routes.POST_CREDIT_TRADE, {
  }).then((response) => {
    debugger;
  }).catch((error) => {
    debugger;
  })
}

export const approveCreditTransfer = (id) => (dispatch) => {
  console.log(id);
  debugger;
}

export const rejectCreditTransfer = (id) => (dispatch) => {
  console.log(id);
  debugger;
}

export const rescindProposal = (id) => (dispatch) => {
  console.log(id);
  debugger;
}

export const recommendForApproval = (id) => (dispatch) => {
  console.log(id);
  debugger;
}

export const recommendForRejection = (id) => (dispatch) => {
  console.log(id);
  debugger;
}
