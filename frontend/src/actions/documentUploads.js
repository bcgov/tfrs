import axios from 'axios';

import CreditTransferActionTypes from '../constants/actionTypes/CreditTransfers';
import CreditTransferReducerTypes from '../constants/reducerTypes/CreditTransfers';
import ActionTypes from '../constants/actionTypes/DocumentUploads';
import ReducerTypes from '../constants/reducerTypes/DocumentUploads';
import * as Routes from '../constants/routes';

/*
 * Add comment to document
 */
const addCommentToDocument = data => (dispatch) => {
  dispatch(addCommentToDocumentRequest());

  return axios
    .post(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.COMMENTS_API}`, data)
    .then((response) => {
      dispatch(addCommentToDocumentSuccess(response.data));
    }).catch((error) => {
      dispatch(addCommentToDocumentError(error.response.data));
      return Promise.reject(error);
    });
};

const addCommentToDocumentRequest = () => ({
  name: ReducerTypes.ADD_COMMENT_TO_DOCUMENT_REQUEST,
  type: ActionTypes.REQUEST
});

const addCommentToDocumentSuccess = data => ({
  name: ReducerTypes.SUCCESS_ADD_COMMENT_TO_DOCUMENT,
  type: ActionTypes.SUCCESS,
  data
});

const addCommentToDocumentError = error => ({
  name: ReducerTypes.ERROR_ADD_COMMENT_TO_DOCUMENT,
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Add Document Upload
 */
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

/*
 * Clear Error Messages
 */
const clearDocumentUploadError = () => ({
  type: ActionTypes.CLEAR_ERROR
});

/*
 * Delete Document Upload
 */
const deleteDocumentUpload = id => (dispatch) => {
  dispatch(deleteDocumentUploadRequest());

  return axios
    .delete(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.API}/${id}`)
    .then((response) => {
      dispatch(deleteDocumentUploadRequestSuccess(response.data));
    }).catch((error) => {
      dispatch(deleteDocumentUploadRequestError(error.response.data));
      return Promise.reject(error);
    });
};

const deleteDocumentUploadRequest = () => ({
  name: ReducerTypes.DELETE_DOCUMENT_UPLOAD_REQUEST,
  type: ActionTypes.REQUEST
});

const deleteDocumentUploadRequestSuccess = data => ({
  name: ReducerTypes.SUCCESS_DELETE_DOCUMENT_UPLOAD,
  type: ActionTypes.SUCCESS,
  data
});

const deleteDocumentUploadRequestError = error => ({
  name: ReducerTypes.ERROR_DELETE_DOCUMENT_UPLOAD,
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Get Documents
 */
const getDocumentUploads = () => (dispatch) => {
  dispatch(getDocumentUploadRequests());
  return axios.get(Routes.BASE_URL + Routes.SECURE_DOCUMENT_UPLOAD.API)
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

const getDocumentUploadURL = data => (dispatch) => {
  dispatch(getDocumentUploadURLRequest());

  return axios
    .get(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.API}/upload_url`, data)
    .then((response) => {
      dispatch(getDocumentUploadURLSuccess(response.data));
      return Promise.resolve(response);
    }).catch((error) => {
      dispatch(getDocumentUploadURLError(error.response.data));
      return Promise.reject(error);
    });
};

const getDocumentUploadURLRequest = () => ({
  name: ReducerTypes.GET_UPLOAD_URL_REQUEST,
  type: ActionTypes.GET_UPLOAD_URL
});

const getDocumentUploadURLSuccess = data => ({
  name: ReducerTypes.SUCCESS_GET_UPLOAD_URL,
  type: ActionTypes.SUCCESS_GET_UPLOAD_URL,
  data
});

const getDocumentUploadURLError = error => ({
  name: ReducerTypes.ERROR_GET_UPLOAD_URL,
  type: ActionTypes.ERROR,
  errorMessage: error
});

export const partialUpdateDocument = (id, data) => (dispatch) => {
  dispatch(updateDocumentUploadRequest({id, data}));

  return axios.patch(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.API}/${id}`, data)
    .then((response) => {
      dispatch(updateDocumentUploadSuccess(response.data));
      return Promise.resolve(response);
    }).catch((error) => {
      dispatch(updateDocumentUploadError(error.response.data));
      return Promise.reject(error);
    });
};

/*
 * Update comment on documents
 */
const updateCommentOnDocument = (id, data) => (dispatch) => {
  dispatch(updateCommentOnDocumentRequest());

  return axios
    .put(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.COMMENTS_API}/${id}`, data)
    .then((response) => {
      dispatch(updateCommentOnDocumentSuccess(response.data));
    }).catch((error) => {
      dispatch(updateCommentOnDocumentError(error.response.data));
      return Promise.reject(error);
    });
};

const updateCommentOnDocumentRequest = () => ({
  name: ReducerTypes.UPDATE_COMMENT_ON_DOCUMENT_REQUEST,
  type: ActionTypes.REQUEST
});

const updateCommentOnDocumentSuccess = data => ({
  name: ReducerTypes.SUCCESS_UPDATE_COMMENT_ON_DOCUMENT,
  type: ActionTypes.SUCCESS,
  data
});

const updateCommentOnDocumentError = error => ({
  name: ReducerTypes.ERROR_UPDATE_COMMENT_ON_DOCUMENT,
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Update documents
 */
const updateDocumentUpload = (id, data) => (dispatch) => {
  dispatch(updateDocumentUploadRequest({id, data}));

  return axios.patch(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.API}/${id}`, data)
    .then((response) => {
      dispatch(updateDocumentUploadSuccess(response.data));
      return Promise.resolve(response);
    }).catch((error) => {
      dispatch(updateDocumentUploadError(error.response));
      return Promise.reject(error);
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

const uploadDocument = (url, blob, callback = null) => (dispatch) => {

  return axios.put(url, blob, {
    'content-type': 'multipart/form-data',
    onUploadProgress: (progressEvent) => {
      if (callback) {
        callback(progressEvent);
      }
    }
  });
};

/*
 * Handle Document Linking and Unlinking
 */
const linkDocument = (id, data) => (dispatch) => {
  dispatch(addDocumentLinkRequest());

  return axios
    .put(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.API}/${id}/link`, data)
    .then((response) => {
      dispatch(addDocumentLinkSuccess(response.data));
      return Promise.resolve(response);
    }).catch((error) => {
      dispatch(addDocumentLinkError(error.response.data));
      return Promise.reject(error);
    });
};

const addDocumentLinkRequest = () => ({
  name: ReducerTypes.ADD_DOCUMENT_LINK,
  type: ActionTypes.ADD_DOCUMENT_LINK
});

const addDocumentLinkSuccess = data => ({
  name: ReducerTypes.SUCCESS_ADD_DOCUMENT_LINK,
  type: ActionTypes.SUCCESS_ADD_DOCUMENT_LINK,
  data
});

const addDocumentLinkError = error => ({
  name: ReducerTypes.ERROR_ADD_DOCUMENT_LINK,
  type: ActionTypes.ERROR,
  errorMessage: error
});

const unlinkDocument = (id, data) => (dispatch) => {
  dispatch(removeDocumentLinkRequest());

  return axios
    .put(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.API}/${id}/unlink`, data)
    .then((response) => {
      dispatch(removeDocumentLinkSuccess(response.data));
      return Promise.resolve(response);
    }).catch((error) => {
      dispatch(removeDocumentLinkError(error.response.data));
      return Promise.reject(error);
    });
};

const removeDocumentLinkRequest = () => ({
  name: ReducerTypes.REMOVE_DOCUMENT_LINK,
  type: ActionTypes.REMOVE_DOCUMENT_LINK
});

const removeDocumentLinkSuccess = data => ({
  name: ReducerTypes.SUCCESS_REMOVE_DOCUMENT_LINK,
  type: ActionTypes.SUCCESS_REMOVE_DOCUMENT_LINK,
  data
});

const removeDocumentLinkError = error => ({
  name: ReducerTypes.ERROR_REMOVE_DOCUMENT_LINK,
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Get Linkable Credit Transactions
 */
const getLinkableCreditTransactions = id => (dispatch) => {
  dispatch(getCreditTransfersRequest());

  return axios
    .get(`${Routes.BASE_URL}${Routes.SECURE_DOCUMENT_UPLOAD.API}/${id}/linkable_credit_transactions`)
    .then((response) => {
      dispatch(getCreditTransfersSuccess(response.data));
      return Promise.resolve(response);
    }).catch((error) => {
      dispatch(getCreditTransfersError(error.response));
      return Promise.reject(error);
    });
};

const getCreditTransfersRequest = () => ({
  name: CreditTransferReducerTypes.GET_CREDIT_TRANSFERS_REQUEST,
  type: CreditTransferActionTypes.GET_CREDIT_TRANSFERS
});

const getCreditTransfersSuccess = creditTransfers => ({
  name: CreditTransferReducerTypes.RECEIVE_CREDIT_TRANSFERS_REQUEST,
  type: CreditTransferActionTypes.RECEIVE_CREDIT_TRANSFERS,
  data: creditTransfers,
  receivedAt: Date.now()
});

const getCreditTransfersError = error => ({
  name: CreditTransferReducerTypes.ERROR_CREDIT_TRANSFERS_REQUEST,
  type: CreditTransferActionTypes.ERROR,
  errorMessage: error
});

export {
  addCommentToDocument,
  addDocumentUpload,
  clearDocumentUploadError,
  deleteDocumentUpload,
  getDocumentUpload,
  getDocumentUploads,
  getDocumentUploadURL,
  getLinkableCreditTransactions,
  updateCommentOnDocument,
  uploadDocument,
  updateDocumentUpload,
  linkDocument,
  unlinkDocument
};
