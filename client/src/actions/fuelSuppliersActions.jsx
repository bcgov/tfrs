import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import { fuelSuppliers } from '../sampleData.jsx';

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
