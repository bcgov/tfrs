import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

const notionalTransferTypes = new GenericRestTemplate(
  'NOTIONAL_TRANFER_TYPES',
  Routes.BASE_URL + Routes.CREDIT_CALCULATIONS.NOTIONAL_TRANFER_TYPES,
  'notionalTransferTypes'
);

export { notionalTransferTypes };
