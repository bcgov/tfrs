const API = '/compliance_reports';
const BASE_PATH = '/compliance_reporting';

const COMPLIANCE_REPORTING = {
  API,
  ADD: `${BASE_PATH}/add/:period/:tab`,
  EDIT: `${BASE_PATH}/edit/:id/:tab`,
  EXPORT: `${API}/:id/xls`,
  SNAPSHOT: `${BASE_PATH}/snapshot/:id`,
  LIST: BASE_PATH
};

export default COMPLIANCE_REPORTING;
