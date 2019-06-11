import axios from 'axios';

import ActionTypes from '../constants/actionTypes/CreditCalculation';
import ReducerTypes from '../constants/reducerTypes/CreditCalculation';
import * as Routes from '../constants/routes';

/*
 * Get Fuel Code
 */
const getCreditCalculation = (id, data) => (dispatch) => {
  dispatch(getCreditCalculationRequest());
  return axios.get(`${Routes.BASE_URL}${Routes.CREDIT_CALCULATIONS.FUEL_TYPES_API}/${id}`, { params: data }).then((response) => {
    dispatch(getCreditCalculationSuccess(response.data));
  }).catch((error) => {
    dispatch(getCreditCalculationError(error.response));
  });
};

const getCreditCalculationRequest = () => ({
  name: ReducerTypes.GET_CREDIT_CALCULATION_REQUEST,
  type: ActionTypes.GET_CREDIT_CALCULATION
});

const getCreditCalculationSuccess = fuelCodes => ({
  name: ReducerTypes.RECEIVE_CREDIT_CALCULATION_REQUEST,
  type: ActionTypes.RECEIVE_CREDIT_CALCULATION,
  data: fuelCodes,
  receivedAt: Date.now()
});

const getCreditCalculationError = error => ({
  name: ReducerTypes.ERROR_CREDIT_CALCULATION_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

export default getCreditCalculation;
