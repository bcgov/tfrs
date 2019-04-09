import * as Routes from '../constants/routes';
import {GenericRestTemplate} from "./base/genericTemplate";

const carbonIntensities = new GenericRestTemplate('CARBON_INTENSITIES',
  Routes.BASE_URL +  Routes.CARBON_INTENSITIES,
  'carbonIntensities');

export {carbonIntensities};
