import ROLES from '../constants/roles';
/*
 * This is for fetching the role description from our constants file as
 * the front-end description might be different from the one coming from the
 * backend
 *
 * @param Object containing the ID of the role we want to get the value of
 *
 * @return String Role Name
 */
const roleName = (role) => {
  const roles = Object.values(ROLES);
  const found = roles.findIndex(element => element.id === role.id);

  if (found >= 0) {
    return roles[found].description;
  }

  return false;
};

export default roleName;
