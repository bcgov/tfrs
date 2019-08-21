import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import { approvedCreditTransfers, creditTransfer, creditTransfers } from './creditTransferReducer';
import { userRequest, userViewRequest, userAdmin } from './userReducer';

import { organizationRequest, organizations, organizationMembers, fuelSuppliersRequest } from './organizationReducer';
import errorRequest from './errorReducer';
import compliancePeriods from './compliancePeriodReducer';
import { documentUpload, documentUploads } from './documentUploadReducer';
import { fuelCode, fuelCodes, latestFuelCode } from './fuelCodesReducer';
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
import { expectedUses } from '../actions/expectedUses';
import { fuelClasses } from '../actions/fuelClasses';
import { notionalTransferTypes } from '../actions/notionalTransferTypes';
import { petroleumCarbonIntensities } from '../actions/petroleumCarbonIntensities';
import { roles } from '../actions/roleActions';
import { complianceReporting } from '../actions/complianceReporting';
import { exclusionReports } from '../actions/exclusionReports';
import { transactionTypes } from '../actions/transactionTypes';
import creditCalculation from './creditCalculationReducer';

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
  latestFuelCode,
  notifications,
  organizationMembers,
  organizationRequest,
  organizations,
  referenceData,
  routing,
  sessionTimeout,
  signingAuthorityAssertions,
  subscriptions,
  tableState,
  userAdmin,
  userRequest,
  userViewRequest,
  roles: roles.reducer(),
  defaultCarbonIntensities: defaultCarbonIntensities.reducer(),
  carbonIntensityLimits: carbonIntensities.reducer(),
  creditCalculation,
  energyDensities: energyDensities.reducer(),
  energyEffectivenessRatios: energyEffectivenessRatios.reducer(),
  expectedUses: expectedUses.reducer(),
  complianceReporting: complianceReporting.reducer(),
  exclusionReports: exclusionReports.reducer(),
  fuelClasses: fuelClasses.reducer(),
  notionalTransferTypes: notionalTransferTypes.reducer(),
  petroleumCarbonIntensities: petroleumCarbonIntensities.reducer(),
  transactionTypes: transactionTypes.reducer()
});

export default rootReducer;
