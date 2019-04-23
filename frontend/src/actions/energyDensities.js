import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

const energyDensities = new GenericRestTemplate(
  'ENERGY_DENSITIES',
  Routes.BASE_URL + Routes.CREDIT_CALCULATIONS.ENERGY_DENSITIES_API,
  'energyDensities'
);

export { energyDensities };
