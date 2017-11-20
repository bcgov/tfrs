// Page Routes

export const HOME = '/';
export const FUEL_SUPPLIERS = '/fuel-suppliers/';
export const ACCOUNT_ACTIVITY = '/account-activity';
export const NOTIFICATIONS = '/notifications';
export const SETTINGS = '/settings';
export const ADMINISTRATION = '/administration';
export const FUEL_SUPPLIER_DETAILS = '/fuel-suppliers/:id';
export const CREDIT_TRANSFER = '/credittransfer/';
export const CREDIT_TRANSFER_DETAILS = '/credittransfer/:id';
export const NOT_FOUND = '/404';

// API Routes
// Change this to relative URL once nginx is in place
export const BASE_URL = location.protocol + '//' + window.location.host + '/api';
//export const BASE_URL = 'http://server-mem-tfrs-dev.pathfinder.gov.bc.ca/api'
console.log("API URL:", BASE_URL);

export const FUEL_SUPPLIERS_API = '/fuelsuppliers';
export const FUEL_SUPPLIER_ACTION_TYPES = '/fuelsupplieractionstypes';
export const FUEL_SUPPLIER_ATTACHMENTS = '/fuelsupplierattachments';
export const FUEL_SUPPLIER_ATTACHMENT_TAGS = '/fuelsupplierattachmenttags';
export const FUEL_SUPPLIER_BALANCES = '/fuelsupplierbalances';
export const FUEL_SUPPLIER_CONTACT_ROLES = '/fuelsuppliercontactroles';
export const FUEL_SUPPLIER_CONTACTS = '/fuelsuppliercontacts';
export const FUEL_SUPPLIER_HISTORIES = '/fuelsupplierhistories';
export const FUEL_SUPPLIERS_CC_DATIUM = '/fuelsuppliersCCDatum';
export const FUEL_SUPPLIER_STATUSES = '/fuelsupplierstatuses';
export const FUEL_SUPPLIER_TYPES = '/fuelsuppliertypes';
export const SEARCH_FUEL_SUPPLIERS = '/fuelsuppliers/search';

export const CREDIT_TRADE_API = '/credittrades';
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
