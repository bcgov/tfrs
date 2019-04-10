import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import { approvedCreditTransfers, creditTransfer, creditTransfers } from './creditTransferReducer';
import { userRequest, userViewRequest, userAdmin } from './userReducer';

import { organizationRequest, organizations, organizationMembers, fuelSuppliersRequest } from './organizationReducer';
import errorRequest from './errorReducer';
import compliancePeriods from './compliancePeriodReducer';
import { documentUpload, documentUploads } from './documentUploadReducer';
import { fuelCode, fuelCodes } from './fuelCodesReducer';
import { roleRequest, roles } from './roleReducer';
import signingAuthorityAssertions from './signingAuthorityAssertionReducer';
import { notifications, subscriptions } from './notificationReducer';
import { referenceData } from './referenceDataReducer';
import sessionTimeout from './sessionTimeoutReducer';
import tableState from './tableStateReducer';
import { autocomplete } from './autocompleteReducer';
import { carbonIntensities } from '../actions/carbonIntensities';
import { defaultCarbonIntensities } from '../actions/defaultCarbonIntensities';
import { energyDensities } from '../actions/energyDensities';
import { energyEffectivenessRatios } from '../actions/energyEffectivenessRatios';

const rootReducer = combineReducers({
  autocomplete,
  approvedCreditTransfers,
  compliancePeriods,
  creditTransfer,
  creditTransfers,
  documentUpload,
  documentUploads,
  errorRequest,
  fuelCode,
  fuelCodes,
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
  tableState,
  userAdmin,
  userRequest,
  userViewRequest,
  defaultCarbonIntensities: defaultCarbonIntensities.reducer(),
  carbonIntensityLimits: carbonIntensities.reducer(),
  energyDensities: energyDensities.reducer(),
  energyEffectivenessRatios: energyEffectivenessRatios.reducer()
});

export default rootReducer;
