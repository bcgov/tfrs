import {takeEvery, all, call} from 'redux-saga/effects';
import {delay} from "redux-saga";
import axios from "axios";
import * as Routes from "../constants/routes";

function* loadAutosaveData(action) {
  const {key, resolve, reject} = action.payload;

  axios
    .get(`${Routes.BASE_URL}${Routes.AUTOSAVE_API}?key=${key}`)
    .then((response) => {
      try {
        const parsed = JSON.parse(response.data.data);
        resolve(parsed);
      } catch (e) {
        reject(e);
      }
    }).catch((error) => {
    reject(error);
  });
}

function* saveAutosaveData(action) {
  const {key, state, resolve, reject} = action.payload;

  const payload = {
    key,
    data: JSON.stringify(state)
  };

  axios
    .post(`${Routes.BASE_URL}${Routes.AUTOSAVE_API}`, payload)
    .then((response) => {
      resolve();
    }).catch((error) => {
    reject(error);
  });
}

function* clearAutosaveData(action) {
  const {resolve, reject} = action.payload;

  axios
    .post(`${Routes.BASE_URL}${Routes.AUTOSAVE_API}/clear`)
    .then((response) => {
      try {
        resolve();
      } catch (e) {
        reject(e);
      }
    }).catch((error) => {
    reject(error);
  });
}

export default function* autosaveSaga() {

  yield all([
    takeEvery('LOAD_AUTOSAVE_DATA', loadAutosaveData),
    takeEvery('SAVE_AUTOSAVE_DATA', saveAutosaveData),
    takeEvery('CLEAR_AUTOSAVE_DATA', clearAutosaveData)
  ]);
}
