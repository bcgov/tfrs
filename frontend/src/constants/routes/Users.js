const BASE_PATH = '/users'

const USERS = {
  ADD: `${BASE_PATH}/add`,
  DETAILS: `${BASE_PATH}/view/:id`,
  DETAILS_BY_USERNAME: `${BASE_PATH}/view_by_username/:username`,
  EDIT: `${BASE_PATH}/edit/:id`,
  EXPORT: `${BASE_PATH}/xls`
}

export default USERS
