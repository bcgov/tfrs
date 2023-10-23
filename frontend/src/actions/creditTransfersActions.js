import axios from 'axios'

import ActionTypes from '../constants/actionTypes/CreditTransfers'
import ReducerTypes from '../constants/reducerTypes/CreditTransfers'
import * as Routes from '../constants/routes'
import { CREDIT_TRANSFER_STATUS, CREDIT_TRANSFER_TYPES, DEFAULT_ORGANIZATION } from '../constants/values'
import moment from 'moment-timezone'
/*
 * Credit Transfers
 */
export const getCreditTransfers = () => (dispatch) => {
  dispatch(getCreditTransfersRequest())
  return axios.get(Routes.BASE_URL + Routes.CREDIT_TRADE_API)
    .then((response) => {
      dispatch(getCreditTransfersSuccess(response.data))
    }).catch((error) => {
      dispatch(getCreditTransfersError(error.response))
    })
}

export const getCreditTransferType = (typeId, updateTimestamp=null) => {
  const jan2024Timestamp = moment('2024-01-01');
  switch (typeId) {
    case CREDIT_TRANSFER_TYPES.validation.id:
      return updateTimestamp && moment(updateTimestamp).isAfter(jan2024Timestamp) ? 'Assessment' : 'Validation';
    case CREDIT_TRANSFER_TYPES.retirement.id:
      return updateTimestamp && moment(updateTimestamp).isAfter(jan2024Timestamp) ? 'Assessment' : 'Reduction';
    case CREDIT_TRANSFER_TYPES.part3Award.id:
      return 'Part 3 Award'
    case CREDIT_TRANSFER_TYPES.adminAdjustment.id:
      return 'Administrative Adjustment'
    default:
      return 'Transfer'
  }
}

export const prepareCreditTransfer = (fields) => {
  // API data structure
  const data = {
    compliancePeriod: (fields.compliancePeriod && fields.compliancePeriod.id > 0)
      ? fields.compliancePeriod.id
      : null,
    initiator: (fields.creditsFrom.id > 0)
      ? fields.creditsFrom.id
      : DEFAULT_ORGANIZATION.id,
    numberOfCredits: parseInt(fields.numberOfCredits, 10),
    respondent: (fields.creditsTo.id > 0)
      ? fields.creditsTo.id
      : DEFAULT_ORGANIZATION.id,
    status: CREDIT_TRANSFER_STATUS.recorded.id,
    tradeEffectiveDate: fields.tradeEffectiveDate,
    type: fields.transferType,
    zeroReason: fields.zeroDollarReason
  }

  switch (fields.transferType) {
    case CREDIT_TRANSFER_TYPES.part3Award.id.toString():
    case CREDIT_TRANSFER_TYPES.validation.id.toString():
      data.initiator = DEFAULT_ORGANIZATION.id
      data.respondent = fields.creditsTo.id

      break
    case CREDIT_TRANSFER_TYPES.retirement.id.toString():
      data.initiator = DEFAULT_ORGANIZATION.id
      data.respondent = fields.creditsFrom.id

      break
    case CREDIT_TRANSFER_TYPES.adminAdjustment.id.toString():
      data.initiator = DEFAULT_ORGANIZATION.id
      data.respondent = fields.creditsTo.id

      break
    default:
      data.initiator = (fields.creditsFrom.id > 0)
        ? fields.creditsFrom.id
        : DEFAULT_ORGANIZATION.id

      data.respondent = (fields.creditsTo.id > 0)
        ? fields.creditsTo.id
        : DEFAULT_ORGANIZATION.id
  }

  if (fields.transferType === CREDIT_TRANSFER_TYPES.sell.id.toString()) {
    data.fairMarketValuePerCredit = fields.fairMarketValuePerCredit
  }

  if (fields.transferType !== CREDIT_TRANSFER_TYPES.sell.id.toString() ||
    parseFloat(fields.fairMarketValuePerCredit) > 0) {
    data.zeroReason = ''
  }

  return data
}

export const shouldGetCreditTransfers = (state) => {
  const { creditTransfers } = state
  if (!creditTransfers) {
    return true
  } else if (creditTransfers.isFetching) {
    return false
  }
  return creditTransfers.didInvalidate
}

export const getCreditTransfersIfNeeded = () =>
  (dispatch, getState) => {
    if (shouldGetCreditTransfers(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(getCreditTransfers())
    }
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve()
  }

const getCreditTransfersRequest = () => ({
  name: ReducerTypes.GET_CREDIT_TRANSFERS_REQUEST,
  type: ActionTypes.GET_CREDIT_TRANSFERS
})

const getCreditTransfersSuccess = creditTransfers => ({
  name: ReducerTypes.RECEIVE_CREDIT_TRANSFERS_REQUEST,
  type: ActionTypes.RECEIVE_CREDIT_TRANSFERS,
  data: creditTransfers,
  receivedAt: Date.now()
})

const getCreditTransfersError = error => ({
  name: ReducerTypes.ERROR_CREDIT_TRANSFERS_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
})

export const invalidateCreditTransfers = creditTransfers => ({
  type: ActionTypes.INVALIDATE_CREDIT_TRANSFERS,
  data: creditTransfers
})

/*
 * Approved Credit Transfers
 */
export const getApprovedCreditTransfers = () => (dispatch) => {
  dispatch(getApprovedCreditTransfersRequest())

  return axios.get(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/list_recorded`)
    .then((response) => {
      dispatch(getApprovedCreditTransfersSuccess(response.data))
    }).catch((error) => {
      dispatch(getCreditTransfersError(error.response))
    })
}

export const getApprovedCreditTransfersIfNeeded = () =>
  (dispatch, getState) => {
    if (shouldGetCreditTransfers(getState())) {
      return dispatch(getApprovedCreditTransfers())
    }

    return Promise.resolve()
  }

const getApprovedCreditTransfersRequest = () => ({
  name: ReducerTypes.GET_APPROVED_CREDIT_TRANSFERS_REQUEST,
  type: ActionTypes.GET_APPROVED_CREDIT_TRANSFERS
})

const getApprovedCreditTransfersSuccess = creditTransfers => ({
  name: ReducerTypes.RECEIVE_APPROVED_CREDIT_TRANSFERS_REQUEST,
  type: ActionTypes.RECEIVE_APPROVED_CREDIT_TRANSFERS,
  data: creditTransfers,
  receivedAt: Date.now()
})

/*
 * Credit Transfer Detail
 */
export const getCreditTransfer = id => (dispatch) => {
  dispatch(getCreditTransferRequest())
  return axios.get(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/${id}`)
    .then((response) => {
      dispatch(getCreditTransferSuccess(response.data))
    }).catch((error) => {
      dispatch(getCreditTransferError(error.response))
    })
}

export const shouldGetCreditTransfer = (state) => {
  const { creditTransfer } = state
  if (!creditTransfer) {
    return true
  } else if (creditTransfer.isFetching) {
    return false
  }
  return creditTransfer.didInvalidate
}

export const getCreditTransferIfNeeded = id =>
  (dispatch, getState) => {
    if (shouldGetCreditTransfer(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(getCreditTransfer(id))
    }
    // Let the calling code know there's nothing to wait for.
    return Promise.resolve()
  }

const getCreditTransferRequest = () => ({
  name: ReducerTypes.GET_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.GET_CREDIT_TRANSFER
})

const getCreditTransferSuccess = creditTransfer => ({
  name: ReducerTypes.RECEIVE_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.RECEIVE_CREDIT_TRANSFER,
  data: creditTransfer,
  receivedAt: Date.now()
})

const getCreditTransferError = error => ({
  name: ReducerTypes.ERROR_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
})

export const invalidateCreditTransfer = creditTransfer => ({
  type: ActionTypes.INVALIDATE_CREDIT_TRANSFER,
  data: creditTransfer
})

/*
 * Add Credit Transfers
 */
export const addCreditTransfer = data => (dispatch) => {
  dispatch(addCreditTransferRequest())

  return axios
    .post(Routes.BASE_URL + Routes.CREDIT_TRADE_API, data)
    .then((response) => {
      dispatch(addCreditTransferSuccess(response.data))
      return Promise.resolve(response)
    }).catch((error) => {
      dispatch(addCreditTransferError(error.response.data))
      return Promise.reject(error)
    })
}

const addCreditTransferRequest = () => ({
  name: ReducerTypes.ADD_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.ADD_CREDIT_TRANSFER
})

const addCreditTransferSuccess = data => ({
  name: ReducerTypes.SUCCESS_ADD_CREDIT_TRANSFER,
  type: ActionTypes.SUCCESS_ADD_CREDIT_TRANSFER,
  data
})

const addCreditTransferError = error => ({
  name: ReducerTypes.ERROR_ADD_CREDIT_TRANSFER,
  type: ActionTypes.ERROR,
  errorMessage: error
})

/*
 * Edit/Update credit transfer
 */
export const updateCreditTransfer = (id, data) => (dispatch) => {
  dispatch(updateCreditTransferRequest())

  return axios
    .put(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/${id}`, data)
    .then((response) => {
      dispatch(updateCreditTransferSuccess(response.data))
      return Promise.resolve(response)
    }).catch((error) => {
      dispatch(updateCreditTransferError(error.response.data))
      return Promise.reject(error)
    })
}

export const partialUpdateCreditTransfer = (id, data) => (dispatch) => {
  dispatch(updateCreditTransferRequest())

  return axios
    .patch(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/${id}`, data)
    .then((response) => {
      dispatch(updateCreditTransferSuccess(response.data))
      return Promise.resolve(response)
    }).catch((error) => {
      dispatch(updateCreditTransferError(error.response.data))
      return Promise.reject(error)
    })
}

const updateCreditTransferRequest = () => ({
  name: ReducerTypes.UPDATE_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.REQUEST
})

const updateCreditTransferSuccess = data => ({
  name: ReducerTypes.SUCCESS_UPDATE_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.SUCCESS,
  data
})

const updateCreditTransferError = error => ({
  name: ReducerTypes.ERROR_ADD_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.ERROR,
  errorMessage: error
})

/*
 * Delete credit transfer
 */
export const deleteCreditTransfer = id => (dispatch) => {
  dispatch(deleteCreditTransferRequest())

  return axios
    .put(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/${id}/delete`)
    .then((response) => {
      dispatch(deleteCreditTransferSuccess(response.data))
    }).catch((error) => {
      dispatch(deleteCreditTransferError(error.response.data))
    })
}

const deleteCreditTransferRequest = () => ({
  name: ReducerTypes.DELETE_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.REQUEST
})

const deleteCreditTransferSuccess = data => ({
  name: ReducerTypes.SUCCESS_DELETE_CREDIT_TRANSFER,
  type: ActionTypes.SUCCESS,
  data
})

const deleteCreditTransferError = error => ({
  name: ReducerTypes.ERROR_ADD_CREDIT_TRANSFER,
  type: ActionTypes.ERROR,
  errorMessage: error
})

/*
 * Approve credit transfer
 */
export const approveCreditTransfer = id => (dispatch) => {
  dispatch(approveCreditTransferRequest())

  return axios
    .put(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/${id}/approve`)
    .then((response) => {
      dispatch(approveCreditTransferSuccess(response.data))
    }).catch((error) => {
      dispatch(approveCreditTransferError(error.response.data))
      return Promise.reject(error)
    })
}

const approveCreditTransferRequest = () => ({
  name: ReducerTypes.APPROVE_CREDIT_TRANSFER,
  type: ActionTypes.REQUEST
})

const approveCreditTransferSuccess = data => ({
  name: ReducerTypes.SUCCESS_APPROVE_CREDIT_TRANSFER,
  type: ActionTypes.SUCCESS,
  data
})

const approveCreditTransferError = error => ({
  name: ReducerTypes.ERROR_APPROVE_CREDIT_TRANSFER,
  type: ActionTypes.ERROR,
  errorMessage: error
})

/*
 * Batch Process Approved Credit Transfers
 */
export const processApprovedCreditTransfers = () => (dispatch) => {
  dispatch(processApprovedCreditTransfersRequest())
  return axios
    .put(`${Routes.BASE_URL}${Routes.CREDIT_TRADE_API}/batch_process`)
    .then((response) => {
      dispatch(processApprovedCreditTransfersSuccess(response.data))
    }).catch((error) => {
      dispatch(processApprovedCreditTransfersError(error.response.data))
      return Promise.reject(error)
    })
}

const processApprovedCreditTransfersRequest = () => ({
  name: ReducerTypes.PROCESS_APPROVED_CREDIT_TRANSFERS,
  type: ActionTypes.PROCESS_APPROVED_CREDIT_TRANSFERS
})

const processApprovedCreditTransfersSuccess = data => ({
  name: ReducerTypes.SUCCESS_APPROVED_CREDIT_TRANSFERS,
  type: ActionTypes.SUCCESS,
  message: data.message
})

const processApprovedCreditTransfersError = error => ({
  name: ReducerTypes.ERROR_APPROVED_CREDIT_TRANSFERS,
  type: ActionTypes.COMMIT_ERRORS,
  errorMessage: error
})

/*
 * Add comment to credit transfer
 */
export const addCommentToCreditTransfer = data => (dispatch) => {
  dispatch(addCommentToCreditTransferRequest())

  return axios
    .post(`${Routes.BASE_URL}${Routes.COMMENTS_API}`, data)
    .then((response) => {
      dispatch(addCommentToCreditTransferSuccess(response.data))
    }).catch((error) => {
      dispatch(addCommentToCreditTransferError(error.response.data))
      return Promise.reject(error)
    })
}

const addCommentToCreditTransferRequest = () => ({
  name: ReducerTypes.ADD_COMMENT_TO_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.REQUEST
})

const addCommentToCreditTransferSuccess = data => ({
  name: ReducerTypes.SUCCESS_ADD_COMMENT_TO_CREDIT_TRANSFER,
  type: ActionTypes.SUCCESS,
  data
})

const addCommentToCreditTransferError = error => ({
  name: ReducerTypes.ERROR_ADD_COMMENT_TO_CREDIT_TRANSFER,
  type: ActionTypes.ERROR,
  errorMessage: error
})

/*
 * Update comment on credit transfer
 */
export const updateCommentOnCreditTransfer = (id, data) => (dispatch) => {
  dispatch(updateCommentOnCreditTransferRequest())

  return axios
    .put(`${Routes.BASE_URL}${Routes.COMMENTS_API}/${id}`, data)
    .then((response) => {
      dispatch(updateCommentOnCreditTransferSuccess(response.data))
    }).catch((error) => {
      dispatch(updateCommentOnCreditTransferError(error.response.data))
      return Promise.reject(error)
    })
}

const updateCommentOnCreditTransferRequest = () => ({
  name: ReducerTypes.UPDATE_COMMENT_ON_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.REQUEST
})

const updateCommentOnCreditTransferSuccess = data => ({
  name: ReducerTypes.SUCCESS_UPDATE_COMMENT_ON_CREDIT_TRANSFER,
  type: ActionTypes.SUCCESS,
  data
})

const updateCommentOnCreditTransferError = error => ({
  name: ReducerTypes.ERROR_UPDATE_COMMENT_ON_CREDIT_TRANSFER,
  type: ActionTypes.ERROR,
  errorMessage: error
})

/*
 * Delete comment on credit transfer
 */
export const deleteCommentOnCreditTransfer = id => (dispatch) => {
  dispatch(deleteCommentOnCreditTransferRequest())

  return axios
    .delete(`${Routes.BASE_URL}${Routes.COMMENTS_API}/${id}`)
    .then((response) => {
      dispatch(deleteCommentOnCreditTransferSuccess(response.data))
    }).catch((error) => {
      dispatch(deleteCommentOnCreditTransferError(error.response.data))
      return Promise.reject(error)
    })
}

const deleteCommentOnCreditTransferRequest = () => ({
  name: ReducerTypes.UPDATE_COMMENT_ON_CREDIT_TRANSFER_REQUEST,
  type: ActionTypes.REQUEST
})

const deleteCommentOnCreditTransferSuccess = data => ({
  name: ReducerTypes.SUCCESS_UPDATE_COMMENT_ON_CREDIT_TRANSFER,
  type: ActionTypes.SUCCESS,
  data
})

const deleteCommentOnCreditTransferError = error => ({
  name: ReducerTypes.ERROR_UPDATE_COMMENT_ON_CREDIT_TRANSFER,
  type: ActionTypes.ERROR,
  errorMessage: error
})
