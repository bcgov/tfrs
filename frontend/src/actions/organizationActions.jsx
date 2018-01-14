import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import axios from 'axios';
import * as Routes from '../constants/routes.jsx';
import { organizations, organization } from '../sampleData.jsx';

export const getOrganizations = () => (dispatch, getState) => {
  dispatch(getOrganizationsRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATIONS_API)
  .then((response) => {   
    dispatch(getOrganizationsSuccess(response.data));
  }).catch((error) => {
    dispatch(getOrganizationsError(error.response))
  })
}

const getOrganizationsRequest = () => {
  return {
    name: ReducerTypes.GET_ORGANIZATIONS,
    type: ActionTypes.REQUEST,
  }
}

const getOrganizationsSuccess = (organizations) => {
  return {
    name: ReducerTypes.GET_ORGANIZATIONS,
    type: ActionTypes.SUCCESS,
    data: organizations,
  }
}

const getOrganizationsError = (error) => {
  return {
    name: ReducerTypes.GET_ORGANIZATIONS,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getFuelSuppliers = () => (dispatch, getState) => {
  dispatch(getFuelSuppliersRequest());
  console.log("getting fuel suppliers")
  axios.get(Routes.BASE_URL + Routes.ORGANIZATIONS_FUEL_SUPPLIERS)
  .then((response) => {   
    dispatch(getFuelSuppliersSuccess(response.data));
  }).catch((error) => {
    dispatch(getFuelSuppliersError(error.response))
  })
}

const getFuelSuppliersRequest = () => {
  return {
    name: ReducerTypes.GET_ORGANIZATIONS_FUEL_SUPPLIERS,
    type: ActionTypes.REQUEST,
  }
}

const getFuelSuppliersSuccess = (fuelSuppliers) => {
  return {
    name: ReducerTypes.GET_ORGANIZATIONS_FUEL_SUPPLIERS,
    type: ActionTypes.SUCCESS,
    data: fuelSuppliers,
  }
}

const getFuelSuppliersError = (error) => {
  return {
    name: ReducerTypes.GET_ORGANIZATIONS_FUEL_SUPPLIERS,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const searchOrganizations = (name, city) => (dispatch) => {
}

const searchOrganizationsRequest = () => {
  return {
    name: ReducerTypes.GET_ORGANIZATIONS,
    type: ActionTypes.REQUEST,
  }
}

const searchOrganizationsSuccess = (organizations) => {
  return {
    name: ReducerTypes.SEARCH_ORGANIZATIONS,
    type: ActionTypes.SUCCESS,
    data: organizations,
  }
}

const searchOrganizationsError = (error) => {
  return {
    name: ReducerTypes.GET_ORGANIZATIONS,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const searchOrganizationsReset = () => {
  return {
    name: ReducerTypes.SEARCH_ORGANIZATIONS,
    type: ActionTypes.RESET,
  }
}

export const addOrganization = (id) => (dispatch) => {
  console.log(id)
  dispatch(addOrganizationSuccess());
}

const addOrganizationSuccess = () => {
  return {
    name: ReducerTypes.ADD_ORGANIZATION,
    type: ActionTypes.SUCCESS,
  }
}

export const getOrganization = (id) => (dispatch) => {
  dispatch(getOrganizationRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATIONS_API + '/' + id)
  .then((response) => {  
    dispatch(getOrganizationSuccess(response.data));
  }).catch((error) => {
    dispatch(getOrganizationError(error.response))
  })
}

const getOrganizationRequest = () => {
  return {
    name: ReducerTypes.GET_ORGANIZATION,
    type: ActionTypes.REQUEST,
  }
}

const getOrganizationSuccess = (organization) => {
  return {
    name: ReducerTypes.GET_ORGANIZATION,
    type: ActionTypes.SUCCESS,
    data: organization,
  }
}

const getOrganizationError = (error) => {
  return {
    name: ReducerTypes.GET_ORGANIZATION,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const addContact = (data) => (dispatch) => {
  dispatch(addContactRequest());
  axios.post(Routes.BASE_URL + Routes.ORGANIZATION_CONTACTS, {
    organizationFK: data.organizationFK,
    surname: data.contactSurname,
    givenName: data.contactGivenName,
    mobilePhoneNumber: data.contactCellPhone,
    workPhoneNumber: data.contactWorkPhone,
    emailAddress: data.contactEmail,
  })
  .then((response) => {
    dispatch(addContactSuccess());
    dispatch(getOrganizationContacts());
  }).catch((error) => {
    dispatch(addContactError(error.response));
  })
}

const addContactRequest = () => {
  return {
    name: ReducerTypes.ADD_CONTACT,
    type: ActionTypes.REQUEST,
  }
}

const addContactSuccess = () => {
  return {
    name: ReducerTypes.ADD_CONTACT,
    type: ActionTypes.SUCCESS,
  }
}

const addContactError = (error) => {
  return {
    name: ReducerTypes.ADD_CONTACT,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const addContactReset = () => {
  return {
    name: ReducerTypes.ADD_CONTACT,
    type: ActionTypes.RESET,
  }
}

export const deleteContact = (id) => (dispatch) => {
  dispatch(deleteContactRequest());
  axios.post(Routes.BASE_URL + Routes.ORGANIZATION_CONTACTS + '/' + id + Routes.DELETE)
  .then((response) => {
    dispatch(deleteContactSuccess());
    dispatch(getOrganizationContacts());
  }).catch((error) => {
    dispatch(deleteContactError(error.response));
  })
}

const deleteContactRequest = () => {
  return {
    name: ReducerTypes.DELETE_CONTACT,
    type: ActionTypes.REQUEST,
  }
}

const deleteContactSuccess = () => {
  return {
    name: ReducerTypes.DELETE_CONTACT,
    type: ActionTypes.SUCCESS,
  }
}

const deleteContactError = (error) => {
  return {
    name: ReducerTypes.DELETE_CONTACT,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const deleteContactReset = () => {
  return {
    name: ReducerTypes.DELETE_CONTACT,
    type: ActionTypes.RESET,
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

export const getOrganizationActionTypes = () => (dispatch, getState) => {
  dispatch(getOrganizationActionTypesRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATION_ACTION_TYPES)
  .then((response) => {
    dispatch(getOrganizationActionTypesSuccess(response.data));
  }).catch((error) => {
    dispatch(getOrganizationActionTypesError(error.response))
  })
}

const getOrganizationActionTypesRequest = () => {
  return {
    name: ReducerTypes.ORGANIZATION_ACTION_TYPES,
    type: ActionTypes.REQUEST,
  }
}

const getOrganizationActionTypesSuccess = (organizations) => {
  return {
    name: ReducerTypes.ORGANIZATION_ACTION_TYPES,
    type: ActionTypes.SUCCESS,
    data: organizations,
  }
}

const getOrganizationActionTypesError = (error) => {
  return {
    name: ReducerTypes.ORGANIZATION_ACTION_TYPES,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getOrganizationActionType = (id) => (dispatch) => {
  dispatch(getOrganizationActionTypeRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATION_ACTION_TYPES + id)
  .then((response) => {
    dispatch(getOrganizationActionTypeSuccess(response.data));
  }).catch((error) => {
    dispatch(getOrganizationActionTypeError(error.response))
  })
}

const getOrganizationActionTypeRequest = () => {
  return {
    name: ReducerTypes.ORGANIZATION_ACTION_TYPE,
    type: ActionTypes.REQUEST,
  }
}

const getOrganizationActionTypeSuccess = (organizations) => {
  return {
    name: ReducerTypes.ORGANIZATION_ACTION_TYPE,
    type: ActionTypes.SUCCESS,
    data: organizations,
  }
}

const getOrganizationActionTypeError = (error) => {
  return {
    name: ReducerTypes.ORGANIZATION_ACTION_TYPE,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getOrganizationStatuses = () => (dispatch) => {
  dispatch(getOrganizationStatusesRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATION_STATUSES)
  .then((response) => {
    dispatch(getOrganizationStatusesSuccess(response.data));
  }).catch((error) => {
    dispatch(getOrganizationStatusesError(error.response))
  })
}

const getOrganizationStatusesRequest = () => {
  return {
    name: ReducerTypes.ORGANIZATION_STATUSES,
    type: ActionTypes.REQUEST,
  }
}

const getOrganizationStatusesSuccess = (organizations) => {
  return {
    name: ReducerTypes.ORGANIZATION_STATUSES,
    type: ActionTypes.SUCCESS,
    data: organizations,
  }
}

const getOrganizationStatusesError = (error) => {
  return {
    name: ReducerTypes.ORGANIZATION_STATUSES,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getOrganizationStatus = (id) => (dispatch) => {
  dispatch(getOrganizationStatusRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATION_STATUSES + '/' + id)
  .then((response) => {
    dispatch(getOrganizationStatusSuccess(response.data));
  }).catch((error) => {
    dispatch(getOrganizationStatusError(error.response))
  })
}

const getOrganizationStatusRequest = () => {
  return {
    name: ReducerTypes.ORGANIZATION_STATUS,
    type: ActionTypes.REQUEST,
  }
}

const getOrganizationStatusSuccess = (organizations) => {
  return {
    name: ReducerTypes.ORGANIZATION_STATUS,
    type: ActionTypes.SUCCESS,
    data: organizations,
  }
}

const getOrganizationStatusError = (error) => {
  return {
    name: ReducerTypes.ORGANIZATION_STATUS,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getOrganizationTypes = () => (dispatch) => {
  dispatch(getOrganizationTypesRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATION_TYPES)
  .then((response) => {
    dispatch(getOrganizationTypesSuccess(response.data));
  }).catch((error) => {
    dispatch(getOrganizationTypesError(error.response))
  })
}

const getOrganizationTypesRequest = () => {
  return {
    name: ReducerTypes.ORGANIZATION_TYPES,
    type: ActionTypes.REQUEST,
  }
}

const getOrganizationTypesSuccess = (organizations) => {
  return {
    name: ReducerTypes.ORGANIZATION_TYPES,
    type: ActionTypes.SUCCESS,
    data: organizations,
  }
}

const getOrganizationTypesError = (error) => {
  return {
    name: ReducerTypes.ORGANIZATION_TYPES,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getOrganizationType = (id) => (dispatch) => {
  dispatch(getOrganizationTypeRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATION_TYPES + '/' + id)
  .then((response) => {
    dispatch(getOrganizationTypeSuccess(response.data));
  }).catch((error) => {
    dispatch(getOrganizationTypeError(error.response))
  })
}

const getOrganizationTypeRequest = () => {
  return {
    name: ReducerTypes.ORGANIZATION_TYPE,
    type: ActionTypes.REQUEST,
  }
}

const getOrganizationTypeSuccess = (organizations) => {
  return {
    name: ReducerTypes.ORGANIZATION_TYPE,
    type: ActionTypes.SUCCESS,
    data: organizations,
  }
}

const getOrganizationTypeError = (error) => {
  return {
    name: ReducerTypes.ORGANIZATION_TYPE,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getOrganizationContacts = () => (dispatch) => {
  dispatch(getOrganizationContactsRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATION_CONTACTS)
  .then((response) => {
    dispatch(getOrganizationContactsSuccess(response.data));
  }).catch((error) => {
    dispatch(getOrganizationContactsError(error.response))
  })
}

const getOrganizationContactsRequest = () => {
  return {
    name: ReducerTypes.ORGANIZATION_CONTACTS,
    type: ActionTypes.REQUEST,
  }
}

const getOrganizationContactsSuccess = (contacts) => {
  return {
    name: ReducerTypes.ORGANIZATION_CONTACTS,
    type: ActionTypes.SUCCESS,
    data: contacts,
  }
}

const getOrganizationContactsError = (error) => {
  return {
    name: ReducerTypes.ORGANIZATION_CONTACTS,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}

export const getOrganizationAttachments = () => (dispatch) => {
  dispatch(getOrganizationAttachmentsRequest());
  axios.get(Routes.BASE_URL + Routes.ORGANIZATION_ATTACHMENTS)
  .then((response) => {
    dispatch(getOrganizationAttachmentsSuccess(response.data));
  }).catch((error) => {
    dispatch(getOrganizationAttachmentsError(error.response))
  })
}

const getOrganizationAttachmentsRequest = () => {
  return {
    name: ReducerTypes.ORGANIZATION_ATTACHMENTS,
    type: ActionTypes.REQUEST,
  }
}

const getOrganizationAttachmentsSuccess = (attachments) => {
  return {
    name: ReducerTypes.ORGANIZATION_ATTACHMENTS,
    type: ActionTypes.SUCCESS,
    data: attachments,
  }
}

const getOrganizationAttachmentsError = (error) => {
  return {
    name: ReducerTypes.ORGANIZATION_ATTACHMENTS,
    type: ActionTypes.ERROR,
    errorMessage: error
  }
}