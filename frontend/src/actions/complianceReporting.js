import * as Routes from '../constants/routes';
import {GenericRestTemplate} from './base/genericTemplate';
import axios from 'axios';
import {createActions, handleActions} from 'redux-actions';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import {delay} from 'redux-saga';


class ComplianceReportingRestInterface extends GenericRestTemplate {

  constructor(name, baseUrl, stateName) {
    super(name, baseUrl, stateName);

    this.validateHandler = this.validateHandler.bind(this);
    this.doValidate = this.doValidate.bind(this);

  }

  getCustomIdentityActions() {
    return ['VALIDATE', 'VALIDATE_SUCCESS']
  }

  getCustomDefaultState() {
    return {
      isValidating: false,
      validationMessages: {},
      validationPassed: false
    }
  }

  getCustomReducerMap() {
    return [
      [this.validate, (state, action) => ({
        ...state,
        isValidating: true,
        validationState: action.payload || null,
        validationMessages: {},
        validationPassed: false
      })],
      [this.validateSuccess, (state, action) => ({
        ...state,
        isValidating: false,
        validationState: null,
        validationMessages: action.payload,
        validationPassed: Object.keys(action.payload).length === 0
      })],
    ]
  }

  validationStateSelector () {
    const sn = this.stateName;

    return state => (state.rootReducer[sn].validationState);
  }

  doValidate(data = null) {
    const {id, state} = data;
    return axios.post(`${this.baseUrl}/${id}/validate_partial`, state);
  }

  * validateHandler() {
    yield call(delay, 2500); //debounce

    const data = yield (select(this.validationStateSelector()));

    try {
      const response = yield call(this.doValidate, data);
      yield put(this.validateSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  getCustomSagas() {
    return [
      takeLatest(this.validate, this.validateHandler),
    ]
  }

}

const complianceReporting = new ComplianceReportingRestInterface(
  'COMPLIANCE_REPORTING',
  Routes.BASE_URL + Routes.COMPLIANCE_REPORTING_API,
  'complianceReporting'
);

export {complianceReporting};
