import axios from 'axios'
import { call, put, select, takeLatest, delay } from 'redux-saga/effects'

import * as Routes from '../constants/routes'
import { GenericRestTemplate } from './base/genericTemplate'

class ComplianceReportingRestInterface extends GenericRestTemplate {
  constructor (name, baseUrl, stateName) {
    super(name, baseUrl, stateName)

    this.validateHandler = this.validateHandler.bind(this)
    this.doValidate = this.doValidate.bind(this)

    this.recomputeHandler = this.recomputeHandler.bind(this)
    this.doRecompute = this.doRecompute.bind(this)

    this.getSnapshotHandler = this.getSnapshotHandler.bind(this)
    this.doGetSnapshot = this.doGetSnapshot.bind(this)

    this.getDashboardHandler = this.getDashboardHandler.bind(this)
    this.getSupplemetalHandler = this.getSupplemetalHandler.bind(this)
    this.doGetDashboard = this.doGetDashboard.bind(this)
    this.findPaginatedHandler = this.findPaginatedHandler.bind(this)
    this.doFindPaginated = this.doFindPaginated.bind(this)
    this.supplemental = this.supplemental.bind(this)
  }

  getCustomIdentityActions () {
    return [
      'VALIDATE', 'VALIDATE_SUCCESS',
      'RECOMPUTE', 'RECOMPUTE_SUCCESS',
      'GET_SNAPSHOT', 'GET_SNAPSHOT_SUCCESS',
      'GET_DASHBOARD', 'GET_DASHBOARD_SUCCESS',
      'GET_SUPPLEMENTAL', 'GET_SUPPLEMENTAL_SUCCESS',
      'FIND_PAGINATED', 'FIND_PAGINATED_SUCCESS'
    ]
  }

  // eslint-disable-next-line class-methods-use-this
  getCustomDefaultState () {
    return {
      isValidating: false,
      validationMessages: {},
      validationPassed: null,
      isRecomputing: false,
      isGettingSnapshot: false,
      snapshotItem: null,
      isGettingDashboard: false,
      recomputeResult: {},
      isFindingPaginated: false,
      paginatedItems: [],
      totalCount: 0
    }
  }

  getCustomReducerMap () {
    return [
      [this.validate, (state, action) => ({
        ...state,
        isValidating: true,
        validationState: action.payload || null,
        validationMessages: {},
        validationPassed: null
      })],
      [this.validateSuccess, (state, action) => ({
        ...state,
        isValidating: false,
        validationState: null,
        validationMessages: action.payload,
        validationPassed: Object.keys(action.payload).length === 0
      })],
      [this.recompute, (state, action) => ({
        ...state,
        isRecomputing: true,
        recomputeState: action.payload || null,
        recomputeResult: {}
      })],
      [this.recomputeSuccess, (state, action) => ({
        ...state,
        isRecomputing: false,
        recomputeState: null,
        recomputeResult: action.payload
      })],
      [this.getSnapshot, (state, action) => ({
        ...state,
        id: action.payload.id || action.payload,
        isGettingSnapshot: true,
        snapshotItem: null
      })],
      [this.getSnapshotSuccess, (state, action) => ({
        ...state,
        isGettingSnapshot: false,
        snapshotItem: action.payload
      })],
      [this.getDashboard, (state, action) => ({
        ...state,
        isGettingDashboard: true,
        items: null
      })],
     
      [this.getDashboardSuccess, (state, action) => ({
        ...state,
        isGettingDashboard: false,
        items: action.payload
      })],
      [this.getSupplemental, (state, action) => ({
        ...state,
        isGettingSupplemental: false,
        supplementalItems: action.payload
      })],
      [this.getSupplementalSuccess, (state, action) => ({
        ...state,
        isGettingSupplemental: false,
        supplementalItems: action.payload
      })],
      [this.findPaginated, (state, action) => ({
        ...state,
        isFindingPaginated: true,
        errorMessage: {},
        findPaginatedState: action.payload
      })],
      [this.findPaginatedSuccess, (state, action) => ({
        ...state,
        paginatedItems: action.payload.results,
        totalCount: action.payload.count,
        isFindingPaginated: false
      })]
    ]
  }

  validationStateSelector () {
    const sn = this.stateName

    return state => (state.rootReducer[sn].validationState)
  }

  recomputeStateSelector () {
    const sn = this.stateName

    return state => (state.rootReducer[sn].recomputeState)
  }

  findPaginatedStateSelector () {
    const sn = this.stateName

    return state => (state.rootReducer[sn].findPaginatedState)
  }

  doValidate (data = null) {
    const { id, state } = data
    return axios.post(`${this.baseUrl}/${id}/validate_partial`, state)
  }

  * validateHandler () {
    yield delay(1000) // debounce

    const data = yield (select(this.validationStateSelector()))

    try {
      const response = yield call(this.doValidate, data)
      yield put(this.validateSuccess(response.data))
    } catch (error) {
      yield put(this.error(error.response.data))
    }
  }

  doRecompute (data = null) {
    const { id, state } = data
    return axios.patch(`${this.baseUrl}/${id}/compute_totals`, state)
  }

  * recomputeHandler () {
    yield delay(500) // debounce

    const data = yield (select(this.recomputeStateSelector()))

    try {
      const response = yield call(this.doRecompute, data)
      yield put(this.recomputeSuccess(response.data))
    } catch (error) {
      yield put(this.error(error.response.data))
    }
  }

  doGetSnapshot (data = null) {
    const id = data
    return axios.get(`${this.baseUrl}/${id}/snapshot`)
  }

  * getSnapshotHandler () {
    const data = yield (select(this.idSelector()))

    try {
      const response = yield call(this.doGetSnapshot, data)
      yield put(this.getSnapshotSuccess(response.data))
    } catch (error) {
      yield put(this.error(error.response.data))
    }
  }

  doGetDashboard () {
    return axios.get(`${this.baseUrl}/dashboard`)
  }
 

  * getDashboardHandler () {
    
    try {
      const response = yield call(this.doGetDashboard)
      yield put(this.getDashboardSuccess(response.data))
    } catch (error) {
      yield put(this.error(error.response.data))
    }
  }
  supplemental () {
    return axios.get(`${this.baseUrl}/supplemental`)
  }
  
  * getSupplemetalHandler () {
  try {
    const response = yield call(this.supplemental)
    yield put(this.getSupplementalSuccess(response.data))
  } catch (error) {
    yield put(this.error(error.response.data))
  }
}
  doFindPaginated (data) {
    const page = data.page
    const pageSize = data.pageSize
    const filters = data.filters
    const sorts = data.sorts
    return axios.post(`${this.baseUrl}/paginated?page=${page}&size=${pageSize}`, { filters, sorts })
  }

  * findPaginatedHandler () {
    yield delay(1000)

    const data = yield (select(this.findPaginatedStateSelector()))

    try {
      const response = yield call(this.doFindPaginated, data)
      yield put(this.findPaginatedSuccess(response.data))
    } catch (error) {
      yield put(this.error(error.response.data))
    }
  }

  getCustomSagas () {
    return [
      takeLatest(this.validate, this.validateHandler),
      takeLatest(this.recompute, this.recomputeHandler),
      takeLatest(this.getSnapshot, this.getSnapshotHandler),
      takeLatest(this.getDashboard, this.getDashboardHandler),
      takeLatest(this.getSupplemental,this.getSupplemetalHandler),
      takeLatest(this.findPaginated, this.findPaginatedHandler),
      

    ]
  }
}

const complianceReporting = new ComplianceReportingRestInterface(
  'COMPLIANCE_REPORTING',
  Routes.BASE_URL + Routes.COMPLIANCE_REPORTING_API,
  'complianceReporting'
)

// eslint-disable-next-line import/prefer-default-export
export { complianceReporting }
