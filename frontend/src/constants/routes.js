// Page Routes

export const HOME = '/';
export const LOGOUT = '/logout';
export const NOTIFICATIONS = '/notifications';
export const SETTINGS = '/settings';

// API Routes
export const BASE_URL = `${window.location.protocol}//${window.location.host}/api`;

export const ORGANIZATIONS_API = '/organizations';
export const ORGANIZATIONS_FUEL_SUPPLIERS = '/organizations/fuel_suppliers';

export const CREDIT_TRADE_API = '/credit_trades';

export const COMMENTS_API = '/comments';

export const USERS = '/users';
export const CURRENT_USER = '/users/current';

// Appended at the end of the route. Ideally this shouldn't be like this,
// It should be an HTTP DELETE request.
export const DELETE = '/delete';

export { default as COMPLIANCE_PERIODS } from './routes/CompliancePeriods';
export { default as CONTACT_US } from './routes/ContactUs';
export { default as SIGNING_AUTHORITY_ASSERTIONS } from './routes/SigningAuthorityAssertions';
export { default as SIGNING_AUTHORITY_CONFIRMATIONS } from './routes/SigningAuthorityConfirmations';
