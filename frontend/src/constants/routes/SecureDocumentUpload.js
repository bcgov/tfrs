const API = '/documents';
const BASE_PATH = '/secure_document_upload';

const SECURE_DOCUMENT_UPLOAD = {
  API,
  ADD: `${BASE_PATH}/add/:type?`,
  DETAILS: `${BASE_PATH}/:id`,
  EDIT: `${BASE_PATH}/:id/edit`,
  LIST: BASE_PATH
};

export default SECURE_DOCUMENT_UPLOAD;
