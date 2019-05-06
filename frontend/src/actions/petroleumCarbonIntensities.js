import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

const petroleumCarbonIntensities = new GenericRestTemplate(
  'PETROLEUM_CARBON_INTENSITIES',
  Routes.BASE_URL + Routes.CREDIT_CALCULATIONS.PETROLEUM_CARBON_INTENSITIES_API,
  'petroleumCarbonIntensities'
);

export { petroleumCarbonIntensities };
