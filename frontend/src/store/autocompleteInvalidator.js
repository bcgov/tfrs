import { call, put, takeLatest } from 'redux-saga/effects';
import AutocompleteActionTypes from "../constants/actionTypes/Autocomplete";
import FuelCodeActionTypes from '../constants/actionTypes/FuelCodes';

const INVALIDATING_ACTIONS = [
  FuelCodeActionTypes.ADD_FUEL_CODE,
  FuelCodeActionTypes.RECEIVE_FUEL_CODE,
  FuelCodeActionTypes.RECEIVE_FUEL_CODES,
  FuelCodeActionTypes.UPDATE_FUEL_CODE,
  FuelCodeActionTypes.DELETE_FUEL_CODE
];

function * invalidateCache () {
  yield put({ type: AutocompleteActionTypes.INVALIDATE_AUTOCOMPLETE_CACHE });
}

export default function * sessionTimeoutSaga () {
  yield takeLatest(
    action => (INVALIDATING_ACTIONS.includes(action.type)),
    invalidateCache
  );
}
