import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import { approvedCreditTransfers, creditTransfer, creditTransfers } from './creditTransferReducer';
import { userRequest, userViewRequest, userAdmin } from './userReducer';

import { organizationRequest, organizations, organizationMembers, fuelSuppliersRequest } from './organizationReducer';
import errorRequest from './errorReducer';
import compliancePeriods from './compliancePeriodReducer';
import { documentUpload, documentUploads } from './documentUploadReducer';
import { roleRequest, roles } from './roleReducer';
import signingAuthorityAssertions from './signingAuthorityAssertionReducer';
import { notifications, subscriptions } from './notificationReducer';
import { referenceData } from './referenceDataReducer';
import sessionTimeout from './sessionTimeoutReducer';
import {uploadProgress} from './uploadProgress';

const rootReducer = combineReducers({
  approvedCreditTransfers,
  compliancePeriods,
  creditTransfer,
  creditTransfers,
  documentUpload,
  documentUploads,
  errorRequest,
  fuelSuppliersRequest,
  notifications,
  organizationMembers,
  organizationRequest,
  organizations,
  referenceData,
  roleRequest,
  roles,
  routing,
  sessionTimeout,
  signingAuthorityAssertions,
  subscriptions,
  uploadProgress,
  userAdmin,
  userRequest,
  userViewRequest
});

export default rootReducer;
