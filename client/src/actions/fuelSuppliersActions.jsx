import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import axios from 'axios';
import * as Routes from '../constants/routes.jsx';
import { fuelSuppliers, fuelSupplier } from '../sampleData.jsx';

export const getFuelSuppliers = () => (dispatch) => {
  dispatch(getFuelSuppliersRequest());
  axios.get(Routes.BASE_URL + Routes.FUEL_SUPPLIERS_API)
  .then((response) => {
    dispatch(getFuelSuppliersSuccess(fuelSuppliers));
  }).catch((error) => {
    dispatch(getFuelSuppliersError(error.response))
  })
}

const getFuelSuppliersRequest = () => {
  return {
    name: ReducerTypes.GET_FUEL_SUPPLIERS,
    type: ActionTypes.SUCCESS,
  }
}

const getFuelSuppliersSuccess = (fuelSuppliers) => {
  return {
    name: ReducerTypes.GET_FUEL_SUPPLIERS,
    type: ActionTypes.SUCCESS,
    data: fuelSuppliers,
  }
}

const getFuelSuppliersError = (error) => {
  return {
    name: ReducerTypes.GET_FUEL_SUPPLIERS,
    type: ActionTypes.SUCCESS,
    errorMessage: error
  }
}

export const searchFuelSuppliers = (name, city) => (dispatch) => {
  dispatch(searchFuelSuppliersSuccess(fuelSuppliers));
}

const searchFuelSuppliersSuccess = (fuelSuppliers) => {
  return {
    name: ReducerTypes.SEARCH_FUEL_SUPPLIERS,
    type: ActionTypes.SUCCESS,
    data: fuelSuppliers,
  }
}

export const searchFuelSuppliersReset = () => {
  return {
    name: ReducerTypes.SEARCH_FUEL_SUPPLIERS,
    type: ActionTypes.RESET,
  }
}

export const addFuelSupplier = (id) => (dispatch) => {
  console.log(id)
  dispatch(addFuelSupplierSuccess());
}

const addFuelSupplierSuccess = () => {
  return {
    name: ReducerTypes.ADD_FUEL_SUPPLIER,
    type: ActionTypes.SUCCESS,
  }
}

export const getFuelSupplier = (id) => (dispatch) => {
  dispatch(getFuelSupplierSuccess(fuelSupplier));
}

const getFuelSupplierSuccess = (fuelSupplier) => {
  return {
    name: ReducerTypes.GET_FUEL_SUPPLIER,
    type: ActionTypes.SUCCESS,
    data: fuelSupplier,
  }
}

export const addContact = (data) => (dispatch) => {
  dispatch(addContactSuccess());
}

const addContactSuccess = () => {
  return {
    name: ReducerTypes.ADD_CONTACT,
    type: ActionTypes.SUCCESS,
  }
}

export const verifyID = (id) => (dispatch) => {
  dispatch(verifyIDReset());
}

const verifyIDSuccess = () => {
  return {
    name: ReducerTypes.VERIFY_ID,
    type: ActionTypes.SUCCESS,
  }
}

const verifyIDError = (error) => {
  return {
    name: ReducerTypes.VERIFY_ID,
    type: ActionTypes.ERROR,
    errorMessage: error,
  }
}

export const verifyIDReset = () => {
  return {
    name: ReducerTypes.VERIFY_ID,
    type: ActionTypes.RESET,
  }
}