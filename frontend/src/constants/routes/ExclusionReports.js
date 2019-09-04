const API = '/exclusion_reports';
const BASE_PATH = '/exclusion_reports';

const EXCLUSION_REPORTS = {
  API,
  ADD: `${BASE_PATH}/add/:period/:tab`,
  EDIT: `${BASE_PATH}/edit/:id/:tab`,
  LIST: BASE_PATH,
  SNAPSHOT: `${BASE_PATH}/snapshot/:id`,
  TRANSACTION_TYPES: `${BASE_PATH}/transaction_types`
};

export default EXCLUSION_REPORTS;
