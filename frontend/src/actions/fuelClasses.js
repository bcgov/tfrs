import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

const fuelClasses = new GenericRestTemplate(
  'FUEL_CLASSES',
  Routes.BASE_URL + Routes.CREDIT_CALCULATIONS.FUEL_CLASSES,
  'fuelClasses'
);

export { fuelClasses };
