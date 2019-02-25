const API = '/fuel_codes';
const BASE_PATH = '/admin/fuel_codes';

const FUEL_CODES = {
  ADD: `${BASE_PATH}/add`,
  API,
  DETAILS: `${BASE_PATH}/view/:id`,
  LIST: BASE_PATH
};

export default FUEL_CODES;
