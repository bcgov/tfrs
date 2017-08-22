import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import * as Routes from '../constants/routes.jsx';
import axios from 'axios';
import { activity } from '../sampleData.jsx';
import { CreditTransfer } from '../sampleData.jsx';

export const getAccountActivity = () => (dispatch) => {
  dispatch(getAccountActivityRequest());
  axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_API)
  .then((response) => {
    dispatch(getAccountActivitySuccess(response.data));
  }).catch((error) => {
    dispatch(getAccountActivityError(error.response))
  })
}

const getAccountActivityRequest = () => {
  return {
    name: ReducerTypes.GET_ACCOUNT_ACTIVITY,
    type: ActionTypes.REQUEST,
  }
}

const getAccountActivitySuccess = (activity) => {
  return {
    name: ReducerTypes.GET_ACCOUNT_ACTIVITY,
    type: ActionTypes.SUCCESS,
    data: activity,
  }
}

const getAccountActivityError = (error) => {
  return {
    name: ReducerTypes.GET_ACCOUNT_ACTIVITY,
    type: ActionTypes.ERROR,
    errorMessage: error,
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
  dispatch(getCreditTransferRequest());
  axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_API + '/' + id)
  .then((response) => {   
    dispatch(getCreditTransferSuccess(response.data));
  }).catch((error) => {
    dispatch(getCreditTransferError(error.response))
  })
}

const getCreditTransferRequest = () => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFER,
    type: ActionTypes.SUCCESS,
  }
}

const getCreditTransferSuccess = (data) => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFER,
    type: ActionTypes.SUCCESS,
    data: data,
  }
}

const getCreditTransferError = (error) => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFER,
    type: ActionTypes.SUCCESS,
    errorMessage: error
  }
}

export const getCreditTransferReset = () => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFER,
    type: ActionTypes.RESET,
  }
}

export const getCreditTransfers = () => (dispatch) => {
  axios.post(Routes.BASE_URL + Routes.SEARCH_CREDIT_TRADES, {
  }).then((response) => {
  }).catch((error) => {
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
  axios.post(Routes.BASE_URL + Routes.POST_CREDIT_TRADE, {
  }).then((response) => {
  }).catch((error) => {
  })
}

export const approveCreditTransfer = (id) => (dispatch) => {
}

export const rejectCreditTransfer = (id) => (dispatch) => {
}

export const rescindProposal = (id) => (dispatch) => {
}

export const recommendForApproval = (id) => (dispatch) => {
}

export const recommendForRejection = (id) => (dispatch) => {
}

export const acceptCredit = (id) => (dispatch) => {
}