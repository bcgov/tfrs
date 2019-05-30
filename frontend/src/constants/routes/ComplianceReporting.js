const API = '/compliance_reporting';
const BASE_PATH = '/compliance_reporting';

const COMPLIANCE_REPORTING = {
  API,
  ADD: `${BASE_PATH}/add/:period?/intro`,
  ADD_SCHEDULE_A: `${BASE_PATH}/add/:period?/schedule-a`,
  ADD_SCHEDULE_C: `${BASE_PATH}/add/:period?/schedule-c`,
  EDIT: `${BASE_PATH}/edit/:id/intro`,
  EDIT_SCHEDULE_A: `${BASE_PATH}/edit/:id/schedule-a`,
  EDIT_SCHEDULE_C: `${BASE_PATH}/edit/:id/schedule-c`,
  LIST: BASE_PATH
};

export default COMPLIANCE_REPORTING;
