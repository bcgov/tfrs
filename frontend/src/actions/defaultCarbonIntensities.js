import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

const defaultCarbonIntensities = new GenericRestTemplate(
  'DEFAULT_CARBON_INTENSITIES',
  Routes.BASE_URL + Routes.CREDIT_CALCULATIONS.DEFAULT_CARBON_INTENSITIES,
  'defaultCarbonIntensities'
);

export { defaultCarbonIntensities };
