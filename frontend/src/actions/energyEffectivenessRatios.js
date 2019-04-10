import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

const energyEffectivenessRatios = new GenericRestTemplate(
  'ENERGY_EFFECTIVENESS_RATIO',
  Routes.BASE_URL + Routes.CREDIT_CALCULATIONS.ENERGY_EFFECTIVENESS_RATIO,
  'energyEffectivenessRatio'
);

export { energyEffectivenessRatios };
