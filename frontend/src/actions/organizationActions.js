import axios from 'axios'

import ActionTypes from '../constants/actionTypes/Organizations'
import ReducerTypes from '../constants/reducerTypes/Organizations'
import * as Routes from '../constants/routes'

const getFuelSuppliers = () => (dispatch) => {
  dispatch(getFuelSuppliersRequest())

  axios.get(Routes.BASE_URL + Routes.ORGANIZATIONS_FUEL_SUPPLIERS)
    .then((response) => {
      dispatch(getFuelSuppliersSuccess(response.data))
    }).catch((error) => {
      dispatch(getFuelSuppliersError(error.response))
    })
}

const getFuelSuppliersError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_FUEL_SUPPLIERS_REQUEST,
  type: ActionTypes.ERROR_FUEL_SUPPLIERS
})

const getFuelSuppliersRequest = () => ({
  name: ReducerTypes.GET_FUEL_SUPPLIERS_REQUEST,
  type: ActionTypes.GET_FUEL_SUPPLIERS
})

const getFuelSuppliersSuccess = fuelSuppliers => ({
  data: fuelSuppliers,
  name: ReducerTypes.RECEIVE_FUEL_SUPPLIERS_REQUEST,
  type: ActionTypes.RECEIVE_FUEL_SUPPLIERS
})

const getMyOrganization = () => (dispatch) => {
  dispatch(getOrganizationRequest())

  axios.get(`${Routes.BASE_URL}${Routes.ORGANIZATIONS_API}/mine`)
    .then((response) => {
      dispatch(getOrganizationSuccess(response.data))
    }).catch((error) => {
      dispatch(getOrganizationError(error.response))
    })
}

const getMyOrganizationMembers = () => (dispatch) => {
  dispatch(getOrganizationMembersRequest())

  axios.get(`${Routes.BASE_URL}${Routes.ORGANIZATIONS_API}/members`)
    .then((response) => {
      dispatch(getOrganizationMembersSuccess(response.data))
    }).catch((error) => {
      dispatch(getOrganizationMembersError(error.response))
    })
}

const getOrganization = id => (dispatch) => {
  dispatch(getOrganizationRequest())

  axios.get(`${Routes.BASE_URL}${Routes.ORGANIZATIONS_API}/${id}`)
    .then((response) => {
      dispatch(getOrganizationSuccess(response.data))
    }).catch((error) => {
      dispatch(getOrganizationError(error.response))
    })
}

const getOrganizationError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_ORGANIZATION_REQUEST,
  type: ActionTypes.ERROR
})

const getOrganizationMembers = id => (dispatch) => {
  dispatch(getOrganizationMembersRequest())
  axios.get(`${Routes.BASE_URL}${Routes.ORGANIZATIONS_API}/${id}/users`)
    .then((response) => {
      dispatch(getOrganizationMembersSuccess(response.data))
    }).catch((error) => {
      dispatch(getOrganizationMembersError(error.response))
    })
}

const getOrganizationMembersError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_MEMBERS_REQUEST,
  type: ActionTypes.ERROR_MEMBERS
})

const getOrganizationMembersRequest = () => ({
  name: ReducerTypes.GET_MEMBERS_REQUEST,
  type: ActionTypes.GET_MEMBERS
})

const getOrganizationMembersSuccess = users => ({
  data: users,
  name: ReducerTypes.RECEIVE_MEMBERS_REQUEST,
  type: ActionTypes.RECEIVE_MEMBERS
})

const getOrganizationRequest = () => ({
  name: ReducerTypes.GET_ORGANIZATION_REQUEST,
  type: ActionTypes.GET_ORGANIZATION
})

const getOrganizationSuccess = organization => ({
  data: organization,
  name: ReducerTypes.RECEIVE_ORGANIZATIONS_REQUEST,
  receivedAt: Date.now(),
  type: ActionTypes.RECEIVE_ORGANIZATION
})

const getOrganizations = () => (dispatch, getState) => {
  dispatch(getOrganizationsRequest())
  axios.get(Routes.BASE_URL + Routes.ORGANIZATIONS_API)
    .then((response) => {
      dispatch(getOrganizationsSuccess(response.data))
    }).catch((error) => {
      dispatch(getOrganizationsError(error.response))
    })
}

const getOrganizationsError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_ORGANIZATIONS_REQUEST,
  type: ActionTypes.ERROR
})

const getOrganizationsRequest = () => ({
  name: ReducerTypes.GET_ORGANIZATIONS_REQUEST,
  type: ActionTypes.GET_ORGANIZATIONS
})

const getOrganizationsSuccess = organizations => ({
  data: organizations,
  name: ReducerTypes.RECEIVE_ORGANIZATIONS_REQUEST,
  receivedAt: Date.now(),
  type: ActionTypes.RECEIVE_ORGANIZATIONS
})

const addOrganization = data => (dispatch) => {
  dispatch(addOrganizationRequest(data))

  return axios.post(`${Routes.BASE_URL}${Routes.ORGANIZATIONS_API}`, data)
    .then((response) => {
      dispatch(addOrganizationSuccess(response.data))
      return response.data.id
    }).catch((error) => {
      dispatch(addOrganizationError(error.response))
    })
}

const addOrganizationError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_ADD_ORGANIZATION_REQUEST,
  type: ActionTypes.ADD_ORGANIZATION
})

const addOrganizationRequest = payload => ({
  name: ReducerTypes.ADD_ORGANIZATION_REQUEST,
  type: ActionTypes.ADD_ORGANIZATION,
  data: payload
})

const addOrganizationSuccess = response => ({
  data: response,
  name: ReducerTypes.SUCCESS_ADD_ORGANIZATION_REQUEST,
  type: ActionTypes.ADD_ORGANIZATION
})

const updateOrganization = (data, id) => (dispatch) => {
  dispatch(updateOrganizationRequest({ id, data }))

  return axios.put(`${Routes.BASE_URL}${Routes.ORGANIZATIONS_API}/${id}`, data)
    .then((response) => {
      dispatch(updateOrganizationSuccess(response.data))
    }).catch((error) => {
      dispatch(updateOrganizationError(error.response))
    })
}

const updateOrganizationError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_UPDATE_ORGANIZATION_REQUEST,
  type: ActionTypes.UPDATE_ORGANIZATION
})

const updateOrganizationRequest = payload => ({
  name: ReducerTypes.UPDATE_ORGANIZATION_REQUEST,
  type: ActionTypes.UPDATE_ORGANIZATION,
  data: payload
})

const updateOrganizationSuccess = response => ({
  data: response,
  name: ReducerTypes.SUCCESS_UPDATE_ORGANIZATION_REQUEST,
  type: ActionTypes.UPDATE_ORGANIZATION
})

export {
  getFuelSuppliers, getMyOrganization, getMyOrganizationMembers,
  getOrganization, getOrganizationMembers, getOrganizations,
  addOrganization, updateOrganization
}
