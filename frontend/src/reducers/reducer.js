import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import { approvedCreditTransfers, creditTransfer, creditTransfers } from './creditTransferReducer';
import { userRequest, userViewRequest, createUserRequest } from './userReducer';

import { organizationRequest, organizations, organizationMembers, fuelSuppliersRequest } from './organizationReducer';
import errorRequest from './errorReducer';
import creditTransfersHistory from './creditTransfersHistoryReducer';
import compliancePeriods from './compliancePeriodReducer';
import roles from './roleReducer';
import signingAuthorityAssertions from './signingAuthorityAssertionReducer';
import { notifications, subscriptions } from './notificationReducer';

const rootReducer = combineReducers({
  approvedCreditTransfers,
  compliancePeriods,
  creditTransfer,
  creditTransfers,
  creditTransfersHistory,
  errorRequest,
  fuelSuppliersRequest,
  notifications,
  organizationMembers,
  organizationRequest,
  organizations,
  roles,
  routing,
  signingAuthorityAssertions,
  subscriptions,
  createUserRequest,
  userRequest,
  userViewRequest
});

export default rootReducer;
