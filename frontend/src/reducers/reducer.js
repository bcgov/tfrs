import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

import * as ActionTypes from '../constants/actionTypes';
import * as ReducerTypes from '../constants/reducerTypes';

import { approvedCreditTransfers, creditTransfer, creditTransfers } from './creditTransferReducer';
import { userRequest, userViewRequest } from './userReducer';

import { organizationRequest, organizations, organizationMembers, fuelSuppliersRequest } from './organizationReducer';
import errorRequest from './errorReducer';
import compliancePeriods from './compliancePeriodReducer';
import signingAuthorityAssertions from './signingAuthorityAssertionReducer';

const genericRequest = (state = {
  isFetching: false,
  data: [],
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        success: false
      });
    case ActionTypes.SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        success: true,
        data: action.data
      });
    case ActionTypes.ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        success: false,
        errorMessage: action.errorMessage
      });
    case ActionTypes.RESET:
      return Object.assign({}, state, {
        isFetching: false,
        data: [],
        success: false,
        errorMessage: []
      });
    default: return state;
  }
};

function createReducer (reducerFunction, reducerName) {
  return (state, action) => {
    const { name } = action;
    const isInitializationCall = state === undefined;
    if (name !== reducerName && !isInitializationCall) return state;
    return reducerFunction(state, action);
  };
}

// const creditTransferReducers = combineReducers({
//   creditTransfer,
//   creditTransfers
// });

const rootReducer = combineReducers({
  [ReducerTypes.GET_ACCOUNT_ACTIVITY]: createReducer(genericRequest, ReducerTypes.GET_ACCOUNT_ACTIVITY),
  [ReducerTypes.ACCEPT_CREDIT_TRANSFER]: createReducer(genericRequest, ReducerTypes.ACCEPT_CREDIT_TRANSFER),
  [ReducerTypes.GET_ORGANIZATIONS]: createReducer(genericRequest, ReducerTypes.GET_ORGANIZATIONS),
  [ReducerTypes.GET_ORGANIZATIONS_FUEL_SUPPLIERS]: createReducer(genericRequest, ReducerTypes.GET_ORGANIZATIONS_FUEL_SUPPLIERS),
  [ReducerTypes.GET_ORGANIZATION]: createReducer(genericRequest, ReducerTypes.GET_ORGANIZATION),
  [ReducerTypes.SEARCH_ORGANIZATIONS]: createReducer(genericRequest, ReducerTypes.SEARCH_ORGANIZATIONS),
  [ReducerTypes.ADD_ORGANIZATION]: createReducer(genericRequest, ReducerTypes.ADD_ORGANIZATION),
  [ReducerTypes.GET_NOTIFICATIONS]: createReducer(genericRequest, ReducerTypes.GET_NOTIFICATIONS),
  [ReducerTypes.GET_OPPORTUNITIES]: createReducer(genericRequest, ReducerTypes.GET_OPPORTUNITIES),
  [ReducerTypes.ADD_CONTACT]: createReducer(genericRequest, ReducerTypes.ADD_CONTACT),
  [ReducerTypes.DELETE_CONTACT]: createReducer(genericRequest, ReducerTypes.DELETE_CONTACT),
  [ReducerTypes.VERIFY_ID]: createReducer(genericRequest, ReducerTypes.VERIFY_ID),
  [ReducerTypes.GET_CREDIT_TRANSFER]: createReducer(genericRequest, ReducerTypes.GET_CREDIT_TRANSFER),
  [ReducerTypes.ADD_CREDIT_TRANSFER]: createReducer(genericRequest, ReducerTypes.ADD_CREDIT_TRANSFER),
  [ReducerTypes.UPDATE_CREDIT_TRANSFER]: createReducer(genericRequest, ReducerTypes.UPDATE_CREDIT_TRANSFER),
  [ReducerTypes.DELETE_CREDIT_TRANSFER]: createReducer(genericRequest, ReducerTypes.DELETE_CREDIT_TRANSFER),
  [ReducerTypes.GET_CREDIT_TRANSFERS]: createReducer(genericRequest, ReducerTypes.GET_CREDIT_TRANSFERS),
  [ReducerTypes.GET_APPROVED_CREDIT_TRANSFERS]: createReducer(genericRequest, ReducerTypes.GET_APPROVED_CREDIT_TRANSFERS),
  [ReducerTypes.ORGANIZATION_ACTION_TYPE]: createReducer(genericRequest, ReducerTypes.ORGANIZATION_ACTION_TYPE),
  [ReducerTypes.ORGANIZATION_ACTION_TYPES]: createReducer(genericRequest, ReducerTypes.ORGANIZATION_ACTION_TYPES),
  [ReducerTypes.ORGANIZATION_STATUSES]: createReducer(genericRequest, ReducerTypes.ORGANIZATION_STATUSES),
  [ReducerTypes.ORGANIZATION_STATUS]: createReducer(genericRequest, ReducerTypes.ORGANIZATION_STATUS),
  [ReducerTypes.ORGANIZATION_TYPES]: createReducer(genericRequest, ReducerTypes.ORGANIZATION_TYPES),
  [ReducerTypes.ORGANIZATION_TYPE]: createReducer(genericRequest, ReducerTypes.ORGANIZATION_TYPE),
  [ReducerTypes.ORGANIZATION_CONTACTS]: createReducer(genericRequest, ReducerTypes.ORGANIZATION_CONTACTS),
  [ReducerTypes.ORGANIZATION_ATTACHMENTS]: createReducer(genericRequest, ReducerTypes.ORGANIZATION_ATTACHMENTS),
  [ReducerTypes.USERS]: createReducer(genericRequest, ReducerTypes.USERS),
  [ReducerTypes.GET_LOGGED_IN_USER]: createReducer(genericRequest, ReducerTypes.GET_LOGGED_IN_USER),
  [ReducerTypes.PERMISSIONS]: createReducer(genericRequest, ReducerTypes.PERMISSIONS),
  [ReducerTypes.ROLE_PERMISSIONS]: createReducer(genericRequest, ReducerTypes.ROLE_PERMISSIONS),
  [ReducerTypes.ROLES]: createReducer(genericRequest, ReducerTypes.ROLES),
  [ReducerTypes.USER_ROLES]: createReducer(genericRequest, ReducerTypes.USER_ROLES),
  [ReducerTypes.CREDIT_TRADE_STATUSES]: createReducer(genericRequest, ReducerTypes.CREDIT_TRADE_STATUSES),
  [ReducerTypes.CREDIT_TRADE_TYPES]: createReducer(genericRequest, ReducerTypes.CREDIT_TRADE_TYPES),
  userRequest,
  userViewRequest,
  compliancePeriods,
  approvedCreditTransfers,
  creditTransfer,
  creditTransfers,
  organizationRequest,
  organizationMembers,
  organizations,
  signingAuthorityAssertions,
  fuelSuppliersRequest,
  errorRequest,
  routing
});
export default rootReducer;
