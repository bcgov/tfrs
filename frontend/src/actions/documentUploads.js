import axios from 'axios';

import ActionTypes from '../constants/actionTypes/DocumentUploads';
import ReducerTypes from '../constants/reducerTypes/DocumentUploads';
import * as Routes from '../constants/routes';

const getDocumentUploads = () => (dispatch) => {
  dispatch(getDocumentUploadRequests());
  return axios.get(Routes.BASE_URL + Routes.SECURE_DOCUMENT_UPLOAD.LIST)
    .then((response) => {
      dispatch(getDocumentUploadRequestsSuccess(response.data));
    }).catch((error) => {
      dispatch(getDocumentUploadRequestsError(error.response));
    });
};

const getDocumentUploadRequests = () => ({
  name: ReducerTypes.GET_DOCUMENT_UPLOADS_REQUEST,
  type: ActionTypes.GET_REQUESTS
});

const getDocumentUploadRequestsSuccess = requests => ({
  name: ReducerTypes.RECEIVE_DOCUMENT_UPLOADS_REQUEST,
  type: ActionTypes.RECEIVE_REQUESTS,
  data: requests,
  receivedAt: Date.now()
});

const getDocumentUploadRequestsError = error => ({
  name: ReducerTypes.ERROR_DOCUMENT_UPLOADS_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

const getDocumentUpload = id => (dispatch) => {
  dispatch(getDocumentUploadRequest());
  return axios.get(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.API}/${id}`)
    .then((response) => {
      dispatch(getDocumentUploadRequestSuccess(response.data));
    }).catch((error) => {
      dispatch(getDocumentUploadRequestError(error.response));
    });
};

const getDocumentUploadRequest = () => ({
  name: ReducerTypes.GET_DOCUMENT_UPLOAD_REQUEST,
  type: ActionTypes.GET_REQUEST
});

const getDocumentUploadRequestSuccess = requests => ({
  name: ReducerTypes.RECEIVE_DOCUMENT_UPLOAD_REQUEST,
  type: ActionTypes.RECEIVE_REQUEST,
  data: requests,
  receivedAt: Date.now()
});

const getDocumentUploadRequestError = error => ({
  name: ReducerTypes.ERROR_DOCUMENT_UPLOAD_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

const addDocumentUpload = data => (dispatch) => {
  dispatch(addDocumentUploadRequest());

  return axios
    .post(Routes.BASE_URL + Routes.SECURE_DOCUMENT_UPLOAD.API, data)
    .then((response) => {
      dispatch(addDocumentUploadSuccess(response.data));
      return Promise.resolve(response);
    }).catch((error) => {
      dispatch(addDocumentUploadError(error.response.data));
      return Promise.reject(error);
    });
};

const addDocumentUploadRequest = () => ({
  name: ReducerTypes.ADD_DOCUMENT_UPLOAD_REQUEST,
  type: ActionTypes.ADD_DOCUMENT_UPLOAD
});

const addDocumentUploadSuccess = data => ({
  name: ReducerTypes.SUCCESS_ADD_DOCUMENT_UPLOAD,
  type: ActionTypes.SUCCESS_ADD_DOCUMENT_UPLOAD,
  data
});

const addDocumentUploadError = error => ({
  name: ReducerTypes.ERROR_ADD_DOCUMENT_UPLOAD,
  type: ActionTypes.ERROR,
  errorMessage: error
});

const updateDocumentUpload = (data, id) => (dispatch) => {
  dispatch(updateDocumentUploadRequest({ id, data }));

  return axios.put(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.API}/${id}`, data)
    .then((response) => {
      dispatch(updateDocumentUploadSuccess(response.data));
    }).catch((error) => {
      dispatch(updateDocumentUploadError(error.response));
    });
};

const updateDocumentUploadError = error => ({
  errorMessage: error,
  name: ReducerTypes.ERROR_UPDATE_DOCUMENT_UPLOAD,
  type: ActionTypes.ERROR
});

const updateDocumentUploadRequest = payload => ({
  name: ReducerTypes.UPDATE_DOCUMENT_UPLOAD_REQUEST,
  type: ActionTypes.UPDATE_DOCUMENT_UPLOAD,
  data: payload
});

const updateDocumentUploadSuccess = response => ({
  data: response,
  name: ReducerTypes.SUCCESS_UPDATE_DOCUMENT_UPLOAD,
  type: ActionTypes.SUCCESS_UPDATE_DOCUMENT_UPLOAD
});

export {
  addDocumentUpload,
  getDocumentUpload,
  getDocumentUploads,
  updateDocumentUpload
};
