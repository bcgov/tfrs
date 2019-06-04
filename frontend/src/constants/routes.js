// Page Routes

import CONFIG from '../config';

export const HOME = '/';
export const LOGOUT = '/logout';
export const SETTINGS = '/settings';
export const SETTINGS_PROFILE = '/settings/profile';

// API Routes
export const BASE_URL = `${window.location.protocol}//${window.location.host}/api`;
export const SOCKETIO_URL = `${window.location.protocol}//${window.location.host}/`;

export const AUTOSAVE_API = `/autosave`;

export const ORGANIZATIONS_API = '/organizations';
export const ORGANIZATIONS_FUEL_SUPPLIERS = '/organizations/fuel_suppliers';

export const CREDIT_TRADE_API = '/credit_trades';
export const COMMENTS_API = '/comments';

export const AUTOCOMPLETE_API = '/autocomplete';

export const COMPLIANCE_REPORTING_API = '/compliance_reports';

// to add additional reference data, just add the endpoint and desired state name here
export const REFERENCE_DATA_API_ENDPOINTS = {
  organizationTypes: '/organizations/types',
  organizationActionsTypes: '/organizations/actions_types',
  organizationStatuses: '/organizations/statuses'
};

if (CONFIG.SECURE_DOCUMENT_UPLOAD.ENABLED) {
  REFERENCE_DATA_API_ENDPOINTS.documentCategories = '/documents/categories';
  REFERENCE_DATA_API_ENDPOINTS.documentStatuses = '/documents/statuses';
}

if (CONFIG.FUEL_CODES.ENABLED) {
  REFERENCE_DATA_API_ENDPOINTS.fuelCodeStatuses = '/fuel_codes/statuses';
  REFERENCE_DATA_API_ENDPOINTS.approvedFuels = '/fuel_codes/approved_fuels';
  REFERENCE_DATA_API_ENDPOINTS.transportModes = '/fuel_codes/transport_modes';
}

if (CONFIG.COMPLIANCE_REPORTING.ENABLED) {
  REFERENCE_DATA_API_ENDPOINTS.complianceReportTypes = '/compliance_reports/types';
}

export const CARBON_INTENSITIES = '/credit_calculation/carbon_intensity_limits';

export const USERS = '/users';
export const CURRENT_USER = '/users/current';

// Appended at the end of the route. Ideally this shouldn't be like this,
// It should be an HTTP DELETE request.
export const DELETE = '/delete';
export const NOTIFICATIONS_API = '/notifications';

export { default as COMPLIANCE_PERIODS } from './routes/CompliancePeriods';
export { default as CONTACT_US } from './routes/ContactUs';
export { default as CREDIT_CALCULATIONS } from './routes/CreditCalculations';
export { default as FUEL_CODES } from './routes/FuelCodes';
export { default as ROLES } from './routes/Roles';
export { default as SIGNING_AUTHORITY_ASSERTIONS } from './routes/SigningAuthorityAssertions';
export { default as SIGNING_AUTHORITY_CONFIRMATIONS } from './routes/SigningAuthorityConfirmations';
export { default as NOTIFICATIONS } from './routes/Notifications';
export { default as SECURE_DOCUMENT_UPLOAD } from './routes/SecureDocumentUpload';
