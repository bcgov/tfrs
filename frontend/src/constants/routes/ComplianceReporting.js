const API = '/compliance_reporting';
const BASE_PATH = '/compliance_reporting';

const COMPLIANCE_REPORTING = {
  API,
  ADD: `${BASE_PATH}/add/:period?/intro`,
  ADD_SCHEDULE_A: `${BASE_PATH}/add/:period?/schedule-a`,
  ADD_SCHEDULE_B: `${BASE_PATH}/add/:period?/schedule-b`,
  ADD_SCHEDULE_C: `${BASE_PATH}/add/:period?/schedule-c`,
  ADD_SCHEDULE_D: `${BASE_PATH}/add/:period?/schedule-d`,
  EDIT: `${BASE_PATH}/edit/:id/intro`,
  EDIT_SCHEDULE_A: `${BASE_PATH}/edit/:id/schedule-a`,
  EDIT_SCHEDULE_B: `${BASE_PATH}/edit/:id/schedule-b`,
  EDIT_SCHEDULE_C: `${BASE_PATH}/edit/:id/schedule-c`,
  EDIT_SCHEDULE_D: `${BASE_PATH}/edit/:id/schedule-d`,
  LIST: BASE_PATH
};

export default COMPLIANCE_REPORTING;
