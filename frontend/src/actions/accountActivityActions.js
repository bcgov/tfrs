import * as ActionTypes from '../constants/actionTypes';
import * as ReducerTypes from '../constants/reducerTypes';
import * as Routes from '../constants/routes';
import axios from 'axios';
import createHistory from 'history/createHashHistory';
import { activity } from '../sampleData';
import { CreditTransfer } from '../sampleData';

const history = createHistory();

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

export const getCreditTransfer = (id) => (dispatch) => {
  dispatch(getCreditTransferRequest());
  axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_API + '/' + id)
  .then((response) => {
    dispatch(getCreditTransferSuccess(response.data));
  }).catch((error) => {
    dispatch(getCreditTransferError(error.response))
    history.push(Routes.NOT_FOUND)
  })
}

const getCreditTransferRequest = () => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFER,
    type: ActionTypes.REQUEST,
  }
}

const getCreditTransferSuccess = (creditTransfer) => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFER,
    type: ActionTypes.SUCCESS,
    data: creditTransfer,
  }
}

const getCreditTransferError = (error) => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFER,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getCreditTransferReset = () => {
  return {
    name: ReducerTypes.GET_CREDIT_TRANSFER,
    type: ActionTypes.RESET,
  }
}


export const getCreditTransferHistory = (id) => (dispatch) => {
  dispatch(getCreditTransferHistoryRequest());
  axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_API + '/' + id + '/history')
  .then((response) => {
    dispatch(getCreditTransferHistorySuccess(response.data));
  }).catch((error) => {
    dispatch(getCreditTransferHistoryError(error.response))
  })
}

const getCreditTransferHistoryRequest = () => {
  return {
    name: ReducerTypes.CREDIT_TRANSFER_HISTORY,
    type: ActionTypes.REQUEST,
  }
}

const getCreditTransferHistorySuccess = (history) => {
  return {
    name: ReducerTypes.CREDIT_TRANSFER_HISTORY,
    type: ActionTypes.SUCCESS,
    data: history,
  }
}

const getCreditTransferHistoryError = (error) => {
  return {
    name: ReducerTypes.CREDIT_TRANSFER_HISTORY,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getCreditTransferHistoryReset = () => {
  return {
    name: ReducerTypes.CREDIT_TRANSFER_HISTORY,
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
  dispatch(addCreditTransferRequest());
  axios.post(Routes.BASE_URL + Routes.CREDIT_TRADE_API, {
    fairMarketValuePerCredit: data.valuePerCredit,
    numberOfCredits: data.numberOfCredits,
    tradeEffectiveDate: data.tradeEffectiveDate ? data.tradeEffectiveDate : null,
    respondentFK: data.respondentFK,
    creditTradeStatusFK: data.creditTradeStatusFK,
    initiatorFK: data.initiatorFK,
    creditTradeTypeFK: data.creditTradeTypeFK,
    plainEnglishPhrase: "null"
  }).then((response) => {
    history.push(Routes.ACCOUNT_ACTIVITY);
    dispatch(addCreditTransferSuccess(response.data))
  }).catch((error) => {
    dispatch(addCreditTransferError(error.data));
  })
}

const addCreditTransferRequest = () => {
  return {
    name: ReducerTypes.ADD_CREDIT_TRANSFER,
    type: ActionTypes.REQUEST,
  }
}

const addCreditTransferSuccess = (data) => {
  return {
    name: ReducerTypes.ADD_CREDIT_TRANSFER,
    type: ActionTypes.SUCCESS,
    data: data,
  }
}

const addCreditTransferError = (error) => {
  return {
    name: ReducerTypes.ADD_CREDIT_TRANSFER,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const addCreditTransferReset = () => {
  return {
    name: ReducerTypes.ADD_CREDIT_TRANSFER,
    type: ActionTypes.RESET,
  }
}

export const updateCreditTransfer = (data) => (dispatch) => {
  dispatch(updateCreditTransferRequest());
  axios.put(Routes.BASE_URL + Routes.CREDIT_TRADE_API + '/' + data.id, {
    fairMarketValuePerCredit: data.valuePerCredit,
    numberOfCredits: data.numberOfCredits,
    tradeEffectiveDate: data.tradeEffectiveDate ? data.tradeEffectiveDate :null,
    respondentFK: data.respondentFK,
    creditTradeStatusFK: data.creditTradeStatusFK,
    initiatorFK: data.initiatorFK,
    creditTradeTypeFK: data.creditTradeTypeFK,
    plainEnglishPhrase: "null"
  }).then((response) => {
    history.push(Routes.ACCOUNT_ACTIVITY);
    dispatch(updateCreditTransferSuccess(response.data))
  }).catch((error) => {
    dispatch(updateCreditTransferError(error.response));
  })
}

const updateCreditTransferRequest = () => {
  return {
    name: ReducerTypes.UPDATE_CREDIT_TRANSFER,
    type: ActionTypes.REQUEST,
  }
}

const updateCreditTransferSuccess = (data) => {
  return {
    name: ReducerTypes.UPDATE_CREDIT_TRANSFER,
    type: ActionTypes.SUCCESS,
    data: data,
  }
}

const updateCreditTransferError = (error) => {
  return {
    name: ReducerTypes.UPDATE_CREDIT_TRANSFER,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const deleteCreditTransfer = (id) => (dispatch) => {
  dispatch(deleteCreditTransferRequest());
  axios.post(Routes.BASE_URL + Routes.CREDIT_TRADE_API + '/' + id + Routes.DELETE)
  .then((response) => {
    history.push(Routes.ACCOUNT_ACTIVITY);
    dispatch(deleteCreditTransferSuccess(response.data))
  }).catch((error) => {
    dispatch(deleteCreditTransferError(error.response));
  })
}

const deleteCreditTransferRequest = () => {
  return {
    name: ReducerTypes.DELETE_CREDIT_TRANSFER,
    type: ActionTypes.REQUEST,
  }
}

const deleteCreditTransferSuccess = (data) => {
  return {
    name: ReducerTypes.DELETE_CREDIT_TRANSFER,
    type: ActionTypes.SUCCESS,
    data: data,
  }
}

const deleteCreditTransferError = (error) => {
  return {
    name: ReducerTypes.DELETE_CREDIT_TRANSFER,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
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