import ActionTypes from '../constants/actionTypes/DocumentUploads';

const uploadProgress = (state = {
  inProgress: false,
}, action) => {
  switch (action.type) {
    case ActionTypes.UPLOAD_PROGRESS_STARTED:
      return {
        ...state,
        inProgress: true,
      };
    case ActionTypes.UPLOAD_PROGRESS_ERROR:
      return {
        ...state,
        inProgress: false,
      };
    case ActionTypes.UPLOAD_PROGRESS_REPORT:
      return {
        ...state,
      };
    case ActionTypes.UPLOAD_PROGRESS_COMPLETE:
      return {
        ...state,
        inProgress: true,
      };
    default:
      return state;
  }
};

export { uploadProgress };
