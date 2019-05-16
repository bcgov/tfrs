const API = '/compliance_reporting';
const BASE_PATH = '/compliance_reporting';

const COMPLIANCE_REPORTING = {
  API,
  ADD: `${BASE_PATH}/add/:period?/intro`,
  ADD_SCHEDULE_C: `${BASE_PATH}/add/:period?/schedule-c`,
  LIST: BASE_PATH
};

export default COMPLIANCE_REPORTING;
