import axios from 'axios';
import { delay } from 'redux-saga';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import * as Routes from '../constants/routes';
import { GenericRestTemplate } from './base/genericTemplate';

class ComplianceReportingRestInterface extends GenericRestTemplate {
  constructor (name, baseUrl, stateName) {
    super(name, baseUrl, stateName);

    this.validateHandler = this.validateHandler.bind(this);
    this.doValidate = this.doValidate.bind(this);

    this.recomputeHandler = this.recomputeHandler.bind(this);
    this.doRecompute = this.doRecompute.bind(this);

    this.getSnapshotHandler = this.getSnapshotHandler.bind(this);
    this.doGetSnapshot = this.doGetSnapshot.bind(this);
  }

  getCustomIdentityActions() {
    return ['VALIDATE', 'VALIDATE_SUCCESS',
            'RECOMPUTE', 'RECOMPUTE_SUCCESS',
            'GET_SNAPSHOT', 'GET_SNAPSHOT_SUCCESS']
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
      recomputeResult: {},
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
        recomputeResult: action.payload,
      })],
      [this.getSnapshot, (state, action) => ({
        ...state,
        id: action.payload.id || action.payload,
        isGettingSnapshot: true,
        snapshotItem: null,
      })],
      [this.getSnapshotSuccess, (state, action) => ({
        ...state,
        isGettingSnapshot: false,
        snapshotItem: action.payload,
      })]
    ];
  }

  validationStateSelector () {
    const sn = this.stateName;

    return state => (state.rootReducer[sn].validationState);
  }

  recomputeStateSelector () {
    const sn = this.stateName;

    return state => (state.rootReducer[sn].recomputeState);
  }

  doValidate (data = null) {
    const { id, state } = data;
    return axios.post(`${this.baseUrl}/${id}/validate_partial`, state);
  }

  * validateHandler () {
    yield call(delay, 1000); // debounce

    const data = yield (select(this.validationStateSelector()));

    try {
      const response = yield call(this.doValidate, data);
      yield put(this.validateSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  doRecompute (data = null) {
    const { id, state } = data;
    return axios.patch(`${this.baseUrl}/${id}/compute_totals`, state);
  }

  * recomputeHandler () {
    yield call(delay, 500); // debounce

    const data = yield (select(this.recomputeStateSelector()));

    try {
      const response = yield call(this.doRecompute, data);
      yield put(this.recomputeSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  doGetSnapshot(data = null) {
    const id = data;
    return axios.get(`${this.baseUrl}/${id}/snapshot`);
  }

  * getSnapshotHandler() {
    const data = yield (select(this.idSelector()));

    try {
      const response = yield call(this.doGetSnapshot, data);
      yield put(this.getSnapshotSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  getCustomSagas() {
    return [
      takeLatest(this.validate, this.validateHandler),
      takeLatest(this.recompute, this.recomputeHandler),
      takeLatest(this.getSnapshot, this.getSnapshotHandler),

    ]
  }
}

const complianceReporting = new ComplianceReportingRestInterface(
  'COMPLIANCE_REPORTING',
  Routes.BASE_URL + Routes.COMPLIANCE_REPORTING_API,
  'complianceReporting'
);

// eslint-disable-next-line import/prefer-default-export
export { complianceReporting };
