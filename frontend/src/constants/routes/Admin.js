const BASE_PATH = '/admin'

const CREDIT_TRANSACTIONS_HISTORY = {
  API_PAGINATED: '/credit_trades_history/paginated',
  LIST: `${BASE_PATH}/credit_transactions_history`
}

const FUEL_CODES = {
  ADD: `${BASE_PATH}/fuel_codes/add`,
  API: '/fuel_codes',
  DETAILS: `${BASE_PATH}/fuel_codes/view/:id`,
  EDIT: `${BASE_PATH}/fuel_codes/edit/:id`,
  LIST: `${BASE_PATH}/fuel_codes`,
  EXPORT: '/fuel_codes/xls'
}

const HISTORICAL_DATA_ENTRY = {
  EDIT: `${BASE_PATH}/historical_data_entry/edit/:id`,
  LIST: `${BASE_PATH}/historical_data_entry`
}

const ROLES = {
  DETAILS: `${BASE_PATH}/roles/view/:id`,
  LIST: `${BASE_PATH}/roles`
}

const USERS = {
  ADD: `${BASE_PATH}/users/add`,
  DETAILS: `${BASE_PATH}/users/view/:id`,
  DETAILS_BY_USERNAME: `${BASE_PATH}/users/view_by_username/:username`,
  EDIT: `${BASE_PATH}/users/edit/:id`,
  LIST: `${BASE_PATH}/users`
}

const USER_LOGIN_HISTORY = {
  API: '/user_login_history',
  LIST: `${BASE_PATH}/user_login_history`
}

export {
  CREDIT_TRANSACTIONS_HISTORY,
  FUEL_CODES,
  HISTORICAL_DATA_ENTRY,
  ROLES,
  USERS,
  USER_LOGIN_HISTORY
}
