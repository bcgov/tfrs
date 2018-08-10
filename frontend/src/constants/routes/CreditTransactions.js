const API = '/api/credit_trades';
const BASE_PATH = '/credit_transactions';

const CREDIT_TRANSACTIONS = {
  ADD: `${BASE_PATH}/add`,
  API,
  EDIT: `${BASE_PATH}/edit/:id`,
  EXPORT: `${API}/xls`,
  DETAILS: `${BASE_PATH}/view/:id`,
  LIST: BASE_PATH
};

export default CREDIT_TRANSACTIONS;
