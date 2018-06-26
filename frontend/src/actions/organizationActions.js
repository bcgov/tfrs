import axios from 'axios';

import ActionTypes from '../constants/actionTypes/Organizations';
import ReducerTypes from '../constants/reducerTypes/Organizations';
import * as Routes from '../constants/routes';

const getFuelSuppliers = () => (dispatch, getState) => {
  dispatch(getFuelSuppliersRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATIONS_FUEL_SUPPLIERS)
    .then((response) => {
      dispatch(getFuelSuppliersSuccess(response.data));
    }).catch((error) => {
      dispatch(getFuelSuppliersError(error.response));
    });
};

const getFuelSuppliersError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_FUEL_SUPPLIERS_REQUEST,
  type: ActionTypes.ERROR_FUEL_SUPPLIERS
});

const getFuelSuppliersRequest = () => ({
  name: ReducerTypes.GET_FUEL_SUPPLIERS_REQUEST,
  type: ActionTypes.GET_FUEL_SUPPLIERS
});

const getFuelSuppliersSuccess = fuelSuppliers => ({
  data: fuelSuppliers,
  name: ReducerTypes.RECEIVE_FUEL_SUPPLIERS_REQUEST,
  type: ActionTypes.RECEIVE_FUEL_SUPPLIERS
});

const getOrganization = id => (dispatch) => {
  dispatch(getOrganizationRequest());
  axios.get(`${Routes.BASE_URL}${Routes.ORGANIZATIONS_API}/${id}`)
    .then((response) => {
      dispatch(getOrganizationSuccess(response.data));
    }).catch((error) => {
      dispatch(getOrganizationError(error.response));
    });
};

const getOrganizationError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_ORGANIZATION_REQUEST,
  type: ActionTypes.ERROR_ORGANIZATION
});

const getOrganizationRequest = () => ({
  name: ReducerTypes.GET_ORGANIZATION_REQUEST,
  type: ActionTypes.GET_ORGANIZATION
});

const getOrganizationSuccess = organization => ({
  data: organization,
  name: ReducerTypes.RECEIVE_ORGANIZATIONS_REQUEST,
  receivedAt: Date.now(),
  type: ActionTypes.RECEIVE_ORGANIZATION
});

const getOrganizations = () => (dispatch, getState) => {
  dispatch(getOrganizationsRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATIONS_API)
    .then((response) => {
      dispatch(getOrganizationsSuccess(response.data));
    }).catch((error) => {
      dispatch(getOrganizationsError(error.response));
    });
};

const getOrganizationsError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_ORGANIZATIONS_REQUEST,
  type: ActionTypes.ERROR_ORGANIZATIONS
});

const getOrganizationsRequest = () => ({
  name: ReducerTypes.GET_ORGANIZATIONS_REQUEST,
  type: ActionTypes.GET_ORGANIZATIONS
});

const getOrganizationsSuccess = organizations => ({
  data: organizations,
  name: ReducerTypes.RECEIVE_ORGANIZATIONS_REQUEST,
  receivedAt: Date.now(),
  type: ActionTypes.RECEIVE_ORGANIZATIONS
});

const searchOrganizations = (name, city) => (dispatch) => {
  dispatch(searchOrganizationsRequest());
  axios.get(Routes.BASE_URL + Routes.SEARCH_ORGANIZATIONS)
    .then((response) => {
      dispatch(searchOrganizationsSuccess(response.data));
    }).catch((error) => {
      dispatch(searchOrganizationsError(error.response));
    });
};

const searchOrganizationsError = error => ({
  errorMessage: error,
  name: ReducerTypes.SEARCH_ORGANIZATIONS_REQUEST,
  type: ActionTypes.ERROR_ORGANIZATIONS
});

const searchOrganizationsRequest = () => ({
  name: ReducerTypes.GET_ORGANIZATIONS_REQUEST,
  type: ActionTypes.GET_ORGANIZATIONS
});

const searchOrganizationsReset = () => ({
  name: ReducerTypes.SEARCH_ORGANIZATIONS_REQUEST,
  type: ActionTypes.RESET_ORGANIZATIONS_SEARCH
});

const searchOrganizationsSuccess = organizations => ({
  data: organizations,
  name: ReducerTypes.SEARCH_ORGANIZATIONS_REQUEST,
  type: ActionTypes.RECEIVE_ORGANIZATIONS
});

export {
  getFuelSuppliers, getOrganization, getOrganizations, searchOrganizations, searchOrganizationsReset
};
