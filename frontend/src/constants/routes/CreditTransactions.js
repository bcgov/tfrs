const BASE_PATH = '/credit_transactions';

const CREDIT_TRANSACTIONS = {
  ADD: `${BASE_PATH}/add`,
  ADD_PVR: `${BASE_PATH}/add-pvr`,
  EDIT: `${BASE_PATH}/edit/:id`,
  EDIT_PVR: `${BASE_PATH}/edit-pvr/:id`,
  DETAILS: `${BASE_PATH}/view/:id`,
  LIST: BASE_PATH
};

export default CREDIT_TRANSACTIONS;
