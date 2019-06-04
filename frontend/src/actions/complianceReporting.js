import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

const complianceReporting = new GenericRestTemplate(
  'COMPLIANCE_REPORTING',
  Routes.BASE_URL + Routes.COMPLIANCE_REPORTING_API,
  'complianceReporting'
);

export { complianceReporting };
