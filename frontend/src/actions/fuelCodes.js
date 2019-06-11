import axios from 'axios';

import ActionTypes from '../constants/actionTypes/FuelCodes';
import ReducerTypes from '../constants/reducerTypes/FuelCodes';
import * as Routes from '../constants/routes';
import { FUEL_CODES } from '../constants/routes/Admin';

/*
 * Fuel Codes
 */
export const getFuelCodes = () => (dispatch) => {
  dispatch(getFuelCodesRequest());
  return axios.get(Routes.BASE_URL + FUEL_CODES.API).then((response) => {
    dispatch(getFuelCodesSuccess(response.data));
  }).catch((error) => {
    dispatch(getFuelCodesError(error.response));
  });
};

const getFuelCodesRequest = () => ({
  name: ReducerTypes.GET_FUEL_CODES_REQUEST,
  type: ActionTypes.GET_FUEL_CODES
});

const getFuelCodesSuccess = fuelCodes => ({
  name: ReducerTypes.RECEIVE_FUEL_CODES_REQUEST,
  type: ActionTypes.RECEIVE_FUEL_CODES,
  data: fuelCodes,
  receivedAt: Date.now()
});

const getFuelCodesError = error => ({
  name: ReducerTypes.ERROR_FUEL_CODES_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Add Fuel Code
 */
export const addFuelCode = data => (dispatch) => {
  dispatch(addFuelCodeRequest());

  return axios.post(Routes.BASE_URL + FUEL_CODES.API, data).then((response) => {
    dispatch(addFuelCodeSuccess(response.data));
    return Promise.resolve(response);
  }).catch((error) => {
    dispatch(addFuelCodeError(error.response.data));
    return Promise.reject(error);
  });
};

const addFuelCodeRequest = () => ({
  name: ReducerTypes.ADD_FUEL_CODE_REQUEST,
  type: ActionTypes.ADD_FUEL_CODE
});

const addFuelCodeSuccess = data => ({
  name: ReducerTypes.SUCCESS_ADD_FUEL_CODE,
  type: ActionTypes.SUCCESS,
  data
});

const addFuelCodeError = error => ({
  name: ReducerTypes.ERROR_ADD_FUEL_CODE,
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Delete a Fuel Code
 */
export const deleteFuelCode = id => (dispatch) => {
  dispatch(deleteFuelCodeRequest());

  return axios.delete(`${Routes.BASE_URL}${FUEL_CODES.API}/${id}`).then((response) => {
    dispatch(deleteFuelCodeSuccess(response.data));
    return Promise.resolve(response);
  }).catch((error) => {
    dispatch(deleteFuelCodeError(error.response.data));
    return Promise.reject(error);
  });
};

const deleteFuelCodeRequest = () => ({
  name: ReducerTypes.DELETE_FUEL_CODE_REQUEST,
  type: ActionTypes.DELETE_FUEL_CODE
});

const deleteFuelCodeSuccess = data => ({
  name: ReducerTypes.SUCCESS_DELETE_FUEL_CODE,
  type: ActionTypes.SUCCESS,
  data
});

const deleteFuelCodeError = error => ({
  name: ReducerTypes.ERROR_DELETE_FUEL_CODE,
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Get Fuel Code
 */
export const getFuelCode = id => (dispatch) => {
  dispatch(getFuelCodeRequest());
  return axios.get(`${Routes.BASE_URL}${FUEL_CODES.API}/${id}`).then((response) => {
    dispatch(getFuelCodeSuccess(response.data));
  }).catch((error) => {
    dispatch(getFuelCodeError(error.response));
  });
};

const getFuelCodeRequest = () => ({
  name: ReducerTypes.GET_FUEL_CODE_REQUEST,
  type: ActionTypes.GET_FUEL_CODE
});

const getFuelCodeSuccess = fuelCodes => ({
  name: ReducerTypes.RECEIVE_FUEL_CODE_REQUEST,
  type: ActionTypes.RECEIVE_FUEL_CODE,
  data: fuelCodes,
  receivedAt: Date.now()
});

const getFuelCodeError = error => ({
  name: ReducerTypes.ERROR_FUEL_CODE_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Get the Latest Fuel Code of a version for Validation
 */
export const getLatestFuelCode = data => (dispatch) => {
  dispatch(getLatestFuelCodeRequest());
  return axios.get(`${Routes.BASE_URL}${FUEL_CODES.API}/latest`, { params: data }).then((response) => {
    dispatch(getLatestFuelCodeSuccess(response.data));
  }).catch((error) => {
    dispatch(getFuelCodeError(error.response));
  });
};

const getLatestFuelCodeRequest = () => ({
  name: ReducerTypes.GET_LATEST_FUEL_CODE_REQUEST,
  type: ActionTypes.GET_LATEST_FUEL_CODE
});

const getLatestFuelCodeSuccess = fuelCodes => ({
  name: ReducerTypes.RECEIVE_LATEST_FUEL_CODE_REQUEST,
  type: ActionTypes.RECEIVE_LATEST_FUEL_CODE,
  data: fuelCodes,
  receivedAt: Date.now()
});

/*
 * Update Fuel Code
 */
export const updateFuelCode = (id, data) => (dispatch) => {
  dispatch(updateFuelCodeRequest());

  return axios.patch(`${Routes.BASE_URL}${FUEL_CODES.API}/${id}`, data).then((response) => {
    dispatch(updateFuelCodeSuccess(response.data));
    return Promise.resolve(response);
  }).catch((error) => {
    dispatch(updateFuelCodeError(error.response.data));
    return Promise.reject(error);
  });
};

const updateFuelCodeRequest = () => ({
  name: ReducerTypes.UPDATE_FUEL_CODE_REQUEST,
  type: ActionTypes.UPDATE_FUEL_CODE
});

const updateFuelCodeSuccess = data => ({
  name: ReducerTypes.SUCCESS_UPDATE_FUEL_CODE,
  type: ActionTypes.SUCCESS,
  data
});

const updateFuelCodeError = error => ({
  name: ReducerTypes.ERROR_UPDATE_FUEL_CODE,
  type: ActionTypes.ERROR,
  errorMessage: error
});
