const API = '/documents';
const BASE_PATH = '/part_3_agreements';

const SECURE_DOCUMENT_UPLOAD = {
  API,
  ADD: `${BASE_PATH}/add/:type?`,
  COMMENTS_API: `${API}_comments`,
  DETAILS: `${BASE_PATH}/view/:id`,
  EDIT: `${BASE_PATH}/edit/:id`,
  LIST: BASE_PATH
};

export default SECURE_DOCUMENT_UPLOAD;
