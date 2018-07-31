const BASE_PATH = '/credit_transactions';

const CREDIT_TRANSACTIONS = {
  ADD: `${BASE_PATH}/add`,
  EDIT: `${BASE_PATH}/edit/:id`,
  DETAILS: `${BASE_PATH}/view/:id`,
  LIST: BASE_PATH
};

export default CREDIT_TRANSACTIONS;
