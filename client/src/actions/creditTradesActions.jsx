import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import * as Routes from '../constants/routes.jsx';
import axios from 'axios';

export const getFuelSuppliers = () => (dispatch) => {
  dispatch(getFuelSuppliersRequest());
  axios.get(Routes.BASE_URL + Routes.GET_FUEL_SUPPLIERS)
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