import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
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