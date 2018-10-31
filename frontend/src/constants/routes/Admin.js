const BASE_PATH = '/admin';

const CREDIT_TRANSACTIONS_HISTORY = {
  API: `/credit_trades_history`,
  LIST: `${BASE_PATH}/credit_transactions_history`
};

const HISTORICAL_DATA_ENTRY = {
  EDIT: `${BASE_PATH}/historical_data_entry/edit/:id`,
  LIST: `${BASE_PATH}/historical_data_entry`
};

const ROLES = {
  DETAILS: `${BASE_PATH}/roles/view/:id`,
  LIST: `${BASE_PATH}/roles`
};

const USERS = {
  ADD: `${BASE_PATH}/users/add`,
  DETAILS: `${BASE_PATH}/users/view/:id`,
  DETAILS_BY_USERNAME: `${BASE_PATH}/users/view_by_username/:username`,
  EDIT: `${BASE_PATH}/users/edit/:id`,
  LIST: `${BASE_PATH}/users`
};

export {
  CREDIT_TRANSACTIONS_HISTORY,
  HISTORICAL_DATA_ENTRY,
  ROLES,
  USERS
};
