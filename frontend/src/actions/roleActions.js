import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

const roles = new GenericRestTemplate(
  'ROLES',
  Routes.BASE_URL + Routes.ROLES.API,
  'roles'
);

export { roles };
