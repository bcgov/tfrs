import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

const expectedUses = new GenericRestTemplate(
  'EXPECTED_USES',
  Routes.BASE_URL + Routes.CREDIT_CALCULATIONS.EXPECTED_USES,
  'expectedUses'
);

export { expectedUses };
