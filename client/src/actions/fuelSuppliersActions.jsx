import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import { fuelSuppliers, fuelSupplier } from '../sampleData.jsx';

export const getFuelSuppliers = () => (dispatch) => {
  dispatch(getFuelSuppliersSuccess(fuelSuppliers));
}

const getFuelSuppliersSuccess = (fuelSuppliers) => {
  return {
    name: ReducerTypes.GET_FUEL_SUPPLIERS,
    type: ActionTypes.SUCCESS,
    data: fuelSuppliers,
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