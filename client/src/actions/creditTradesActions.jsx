import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import * as Routes from '../constants/routes.jsx';
import axios from 'axios';

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
    type: ActionTypes.SUCCESS,
  }
}

const getCreditTradesSuccess = (fuelSuppliers) => {
  return {
    name: ReducerTypes.CREDIT_TRADES,
    type: ActionTypes.SUCCESS,
    data: fuelSuppliers,
  }
}

const getCreditTradesError = (error) => {
  return {
    name: ReducerTypes.CREDIT_TRADES,
    type: ActionTypes.SUCCESS,
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
    type: ActionTypes.SUCCESS,
  }
}

const getCreditTradeStatusesSuccess = (fuelSuppliers) => {
  return {
    name: ReducerTypes.CREDIT_TRADE_STATUSES,
    type: ActionTypes.SUCCESS,
    data: fuelSuppliers,
  }
}

const getCreditTradeStatusesError = (error) => {
  return {
    name: ReducerTypes.CREDIT_TRADE_STATUSES,
    type: ActionTypes.SUCCESS,
    errorMessage: error
  }
}