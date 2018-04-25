import axios from 'axios';

import * as ActionTypes from '../constants/actionTypes';
import * as Routes from '../constants/routes';
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES, DEFAULT_ORGANIZATION } from '../constants/values';

/*
 * Credit Transfers
 */
export const getCreditTransfers = () => (dispatch) => {
  dispatch(getCreditTransfersRequest());
  return axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_API)
    .then((response) => {
      dispatch(getCreditTransfersSuccess(response.data));
    }).catch((error) => {
      dispatch(getCreditTransfersError(error.response));
    });
};

export const prepareCreditTransfer = (fields) => {
  // API data structure
  const data = {
    compliancePeriod: (fields.compliancePeriod.id > 0)
      ? fields.compliancePeriod.id
      : null,
    initiator: (fields.creditsFrom.id > 0)
      ? fields.creditsFrom.id
      : DEFAULT_ORGANIZATION.id,
    note: fields.note,
    numberOfCredits: parseInt(fields.numberOfCredits, 10),
    respondent: (fields.creditsTo.id > 0)
      ? fields.creditsTo.id
      : DEFAULT_ORGANIZATION.id,
    status: CREDIT_TRANSFER_STATUS.approved.id,
    tradeEffectiveDate: fields.tradeEffectiveDate,
    type: fields.transferType,
    zeroReason: fields.zeroDollarReason
  };

  switch (fields.transferType) {
    case CREDIT_TRANSFER_TYPES.part3Award.id.toString():
    case CREDIT_TRANSFER_TYPES.validation.id.toString():
      data.initiator = DEFAULT_ORGANIZATION.id;
      data.respondent = fields.creditsTo.id;

      break;
    case CREDIT_TRANSFER_TYPES.retirement.id.toString():
      data.initiator = DEFAULT_ORGANIZATION.id;
      data.respondent = fields.creditsFrom.id;

      break;
    default:
      data.initiator = (fields.creditsFrom.id > 0)
        ? fields.creditsFrom.id
        : DEFAULT_ORGANIZATION.id;

      data.respondent = (fields.creditsTo.id > 0)
        ? fields.creditsTo.id
        : DEFAULT_ORGANIZATION.id;
  }

  if (fields.transferType === CREDIT_TRANSFER_TYPES.sell.id.toString()) {
    data.fairMarketValuePerCredit = fields.fairMarketValuePerCredit;
  }

  if (fields.transferType !== CREDIT_TRANSFER_TYPES.sell.id.toString() ||
    parseFloat(fields.fairMarketValuePerCredit) > 0) {
    data.zeroReason = '';
  }

  return data;
};

export const shouldGetCreditTransfers = (state) => {
  const { creditTransfers } = state;
  if (!creditTransfers) {
    return true;
  } else if (creditTransfers.isFetching) {
    return false;
  }
  return creditTransfers.didInvalidate;
};

export const getCreditTransfersIfNeeded = () =>
  (dispatch, getState) => {
    if (shouldGetCreditTransfers(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(getCreditTransfers());
    }
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve();
  };

const getCreditTransfersRequest = () => ({
  name: 'GET_CREDIT_TRANSFERS_REQUEST',
  type: ActionTypes.GET_CREDIT_TRANSFERS
});

const getCreditTransfersSuccess = creditTransfers => ({
  name: 'RECEIVE_CREDIT_TRANSFERS_REQUEST',
  type: ActionTypes.RECEIVE_CREDIT_TRANSFERS,
  data: creditTransfers,
  receivedAt: Date.now()
});

const getCreditTransfersError = error => ({
  name: 'ERROR_CREDIT_TRANSFERS_REQUEST',
  type: ActionTypes.ERROR,
  errorMessage: error
});

export const invalidateCreditTransfers = creditTransfers => ({
  type: ActionTypes.INVALIDATE_CREDIT_TRANSFERS,
  data: creditTransfers
});

/*
 * Approved Credit Transfers
 */
export const getApprovedCreditTransfers = () => (dispatch) => {
  dispatch(getApprovedCreditTransfersRequest());

  return axios.get(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/list_approved`)
    .then((response) => {
      dispatch(getCreditTransfersSuccess(response.data));
    }).catch((error) => {
      dispatch(getCreditTransfersError(error.response));
    });
};

export const getApprovedCreditTransfersIfNeeded = () =>
  (dispatch, getState) => {
    if (shouldGetCreditTransfers(getState())) {
      return dispatch(getApprovedCreditTransfers());
    }

    return Promise.resolve();
  };

const getApprovedCreditTransfersRequest = () => ({
  name: 'GET_APPROVED_CREDIT_TRANSFERS_REQUEST',
  type: ActionTypes.GET_APPROVED_CREDIT_TRANSFERS
});

/*
 * Credit Transfer Detail
 */
export const getCreditTransfer = id => (dispatch) => {
  dispatch(getCreditTransferRequest());
  return axios.get(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/${id}`)
    .then((response) => {
      dispatch(getCreditTransferSuccess(response.data));
    }).catch((error) => {
      dispatch(getCreditTransferError(error.response));
    });
};

export const shouldGetCreditTransfer = (state) => {
  const { creditTransfer } = state;
  if (!creditTransfer) {
    return true;
  } else if (creditTransfer.isFetching) {
    return false;
  }
  return creditTransfer.didInvalidate;
};

export const getCreditTransferIfNeeded = id =>
  (dispatch, getState) => {
    if (shouldGetCreditTransfer(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(getCreditTransfer(id));
    }
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve();
  };

const getCreditTransferRequest = () => ({
  name: 'GET_CREDIT_TRANSFER_REQUEST',
  type: ActionTypes.GET_CREDIT_TRANSFER
});

const getCreditTransferSuccess = creditTransfer => ({
  name: 'RECEIVE_CREDIT_TRANSFER_REQUEST',
  type: ActionTypes.RECEIVE_CREDIT_TRANSFER,
  data: creditTransfer,
  receivedAt: Date.now()
});

const getCreditTransferError = error => ({
  name: 'ERROR_CREDIT_TRANSFER_REQUEST',
  type: ActionTypes.ERROR,
  errorMessage: error
});

export const invalidateCreditTransfer = creditTransfer => ({
  type: ActionTypes.INVALIDATE_CREDIT_TRANSFER,
  data: creditTransfer
});

/*
 * Add Credit Transfers
 */
export const addCreditTransfer = data => (dispatch) => {
  dispatch(addCreditTransferRequest());

  return axios
    .post(Routes.BASE_URL + Routes.CREDIT_TRADE_API, data)
    .then((response) => {
      dispatch(addCreditTransferSuccess(response.data));
    }).catch((error) => {
      dispatch(addCreditTransferError(error.response.data));
      return Promise.reject(error);
    });
};

const addCreditTransferRequest = () => ({
  name: 'ADD_CREDIT_TRANSFER',
  type: ActionTypes.ADD_CREDIT_TRANSFER
});

const addCreditTransferSuccess = data => ({
  name: 'SUCCESS_ADD_CREDIT_TRANSFER',
  type: ActionTypes.SUCCESS_ADD_CREDIT_TRANSFER,
  data
});

const addCreditTransferError = error => ({
  name: 'ERROR_ADD_CREDIT_TRANSFER',
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Edit/Update credit transfer
 */
export const updateCreditTransfer = (id, data) => (dispatch) => {
  dispatch(updateCreditTransferRequest());
  console.log('updating', data);
  return axios
    .put(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/${id}`, data)
    .then((response) => {
      dispatch(updateCreditTransferSuccess(response.data));
    }).catch((error) => {
      dispatch(updateCreditTransferError(error.response.data));
      return Promise.reject(error);
    });
};

const updateCreditTransferRequest = () => ({
  name: 'UPDATE_CREDIT_TRANSFER',
  type: ActionTypes.REQUEST
});

const updateCreditTransferSuccess = data => ({
  name: 'SUCCESS_UPDATE_CREDIT_TRANSFER',
  type: ActionTypes.SUCCESS,
  data
});

const updateCreditTransferError = error => ({
  name: 'ERROR_ADD_CREDIT_TRANSFER',
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Delete credit transfer
 */
export const deleteCreditTransfer = id => (dispatch) => {
  dispatch(deleteCreditTransferRequest());

  return axios
    .put(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/${id}/delete`)
    .then((response) => {
      dispatch(deleteCreditTransferSuccess(response.data));
    }).catch((error) => {
      dispatch(deleteCreditTransferError(error.response.data));
    });
};

const deleteCreditTransferRequest = () => ({
  name: 'DELETE_CREDIT_TRANSFER',
  type: ActionTypes.REQUEST
});

const deleteCreditTransferSuccess = data => ({
  name: 'SUCCESS_DELETE_CREDIT_TRANSFER',
  type: ActionTypes.SUCCESS,
  data
});

const deleteCreditTransferError = error => ({
  name: 'ERROR_ADD_CREDIT_TRANSFER',
  type: ActionTypes.ERROR,
  errorMessage: error
});

/*
 * Batch Process Approved Credit Transfers
 */
export const processApprovedCreditTransfers = () => (dispatch) => {
  dispatch(processApprovedCreditTransfersRequest());
  return axios
    .put(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/batch_process`)
    .then((response) => {
      dispatch(processApprovedCreditTransfersSuccess(response.data));
    }).catch((error) => {
      dispatch(processApprovedCreditTransfersError(error.response.data));
      return Promise.reject(error);
    });
};

const processApprovedCreditTransfersRequest = () => ({
  name: 'PROCESS_APPROVED_CREDIT_TRANSFERS',
  type: ActionTypes.PROCESS_APPROVED_CREDIT_TRANSFERS
});

const processApprovedCreditTransfersSuccess = data => ({
  name: 'SUCCESS_APPROVED_CREDIT_TRANSFERS',
  type: ActionTypes.SUCCESS,
  message: data.message
});

const processApprovedCreditTransfersError = error => ({
  name: 'ERROR_APPROVED_CREDIT_TRANSFERS',
  type: ActionTypes.COMMIT_ERRORS,
  errorMessage: error
});
