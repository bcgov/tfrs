import * as ActionTypes from '../constants/actionTypes';
import * as ReducerTypes from '../constants/reducerTypes';
import * as Routes from '../constants/routes';
import axios from 'axios';

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
    type: ActionTypes.REQUEST,
  }
}

const getCreditTransfersSuccess = (creditTransfers) => {
  return {
    name: "RECEIVE_CREDIT_TRANSFERS_REQUEST",
    type: ActionTypes.SUCCESS,
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

export const getCreditTrades = () => (dispatch) => {
  dispatch(getCreditTradesRequest());
  axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_API)
  .then((response) => {
    dispatch(getCreditTradesSuccess(response.data));
  }).catch((error) => {
    dispatch(getCreditTradesError(error.response))
  })
}

const getCreditTradesRequest = () => {
  return {
    name: ReducerTypes.CREDIT_TRADES,
    type: ActionTypes.REQUEST,
  }
}

const getCreditTradesSuccess = (organizations) => {
  return {
    name: ReducerTypes.CREDIT_TRADES,
    type: ActionTypes.SUCCESS,
    data: organizations,
  }
}

const getCreditTradesError = (error) => {
  return {
    name: ReducerTypes.CREDIT_TRADES,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getCreditTradeStatuses = () => (dispatch) => {
  dispatch(getCreditTradeStatusesRequest());
  axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_STATUSES)
  .then((response) => {
    dispatch(getCreditTradeStatusesSuccess(response.data));
  }).catch((error) => {
    dispatch(getCreditTradeStatusesError(error.response))
  })
}

const getCreditTradeStatusesRequest = () => {
  return {
    name: ReducerTypes.CREDIT_TRADE_STATUSES,
    type: ActionTypes.REQUEST,
  }
}

const getCreditTradeStatusesSuccess = (statuses) => {
  return {
    name: ReducerTypes.CREDIT_TRADE_STATUSES,
    type: ActionTypes.SUCCESS,
    data: statuses,
  }
}

const getCreditTradeStatusesError = (error) => {
  return {
    name: ReducerTypes.CREDIT_TRADE_STATUSES,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getCreditTradeTypes = () => (dispatch) => {
  dispatch(getCreditTradeTypesRequest());
  axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_TYPES)
  .then((response) => {
    dispatch(getCreditTradeTypesSuccess(response.data));
  }).catch((error) => {
    dispatch(getCreditTradeTypesError(error.response))
  })
}

const getCreditTradeTypesRequest = () => {
  return {
    name: ReducerTypes.CREDIT_TRADE_TYPES,
    type: ActionTypes.REQUEST,
  }
}

const getCreditTradeTypesSuccess = (types) => {
  return {
    name: ReducerTypes.CREDIT_TRADE_TYPES,
    type: ActionTypes.SUCCESS,
    data: types,
  }
}

const getCreditTradeTypesError = (error) => {
  return {
    name: ReducerTypes.CREDIT_TRADE_TYPES,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}