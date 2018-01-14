// Page Routes

export const HOME = '/';
export const ORGANIZATIONS = '/organizations';
export const ACCOUNT_ACTIVITY = '/account-activity';
export const NOTIFICATIONS = '/notifications';
export const SETTINGS = '/settings';
export const ADMINISTRATION = '/administration';
export const ORGANIZATION_DETAILS = '/organizations/:id';
export const CREDIT_TRANSFER = '/credit_transfer/';
export const CREDIT_TRANSFER_DETAILS = '/credit_transfer/:id';
export const NOT_FOUND = '/404';

// API Routes
export const BASE_URL = location.protocol + '//' + window.location.host + '/api';
// console.log("API URL:", BASE_URL);

export const ORGANIZATIONS_API = '/organizations';
export const ORGANIZATION_ACTION_TYPES = '/organizationactionstypes';
export const ORGANIZATION_ATTACHMENTS = '/organizationattachments';
export const ORGANIZATION_ATTACHMENT_TAGS = '/organizationattachmenttags';
export const ORGANIZATION_BALANCES = '/organizationbalances';
export const ORGANIZATION_CONTACT_ROLES = '/organizationcontactroles';
export const ORGANIZATION_CONTACTS = '/organizationcontacts';
export const ORGANIZATION_HISTORIES = '/organizationhistories';
export const ORGANIZATION_STATUSES = '/organizationstatuses';
export const ORGANIZATION_TYPES = '/organizationtypes';
export const SEARCH_ORGANIZATIONS = '/organizations/search';
export const ORGANIZATIONS_FUEL_SUPPLIERS = '/organizations/fuel_suppliers';


export const CREDIT_TRADE_API = '/credit_trades';
export const SEARCH_CREDIT_TRADES = '/credittrades/search';
export const CREDIT_TRADE_STATUSES = '/credittradestatuses';
export const CREDIT_TRADE_TYPES = '/credittradetypes';
export const CREDIT_TRADE_HISTORIES = '/credittradehistories';

export const NOTIFICATION_EVENTS = '/notificationevents';
export const NOTIFICATIONS_API = '/notifications';
export const NOTIFICATION_TYPES = '/notificationtypes';

export const PERMISSIONS = '/permissions';
export const ROLE_PERMISSIONS = '/rolepermissions';
export const ROLES = '/roles';
export const USER_ROLES = '/userroles';
export const USERS = '/users';

// Appended at the end of the route. Ideally this shouldn't be like this,
// It should be an HTTP DELETE request.
export const DELETE = '/delete';
