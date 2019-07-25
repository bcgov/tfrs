import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

const transactionTypes = new GenericRestTemplate(
  'TRANSACTION_TYPES',
  Routes.BASE_URL + Routes.EXCLUSION_REPORTS.TRANSACTION_TYPES,
  'transactionTypes'
);

export { transactionTypes };
