import axios from 'axios';

import ActionTypes from '../constants/actionTypes/DocumentUploads';
import ReducerTypes from '../constants/reducerTypes/DocumentUploads';
import * as Routes from '../constants/routes';

const getDocumentUploads = () => (dispatch) => {
  dispatch(getDocumentUploadRequests());
  return axios.get(Routes.BASE_URL + Routes.SECURE_DOCUMENT_UPLOAD.LIST)
    .then((response) => {
      dispatch(getDocumentUploadRequestSuccess(response.data));
    }).catch((error) => {
      dispatch(getDocumentUploadRequestError(error.response));
    });
};

const getDocumentUploadRequests = () => ({
  name: ReducerTypes.GET_DOCUMENT_UPLOADS_REQUEST,
  type: ActionTypes.GET_REQUESTS
});

const getDocumentUploadRequestSuccess = requests => ({
  name: ReducerTypes.RECEIVE_DOCUMENT_UPLOADS_REQUEST,
  type: ActionTypes.RECEIVE_REQUESTS,
  data: requests,
  receivedAt: Date.now()
});

const getDocumentUploadRequestError = error => ({
  name: ReducerTypes.ERROR_DOCUMENT_UPLOADS_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
});

export default getDocumentUploads;
