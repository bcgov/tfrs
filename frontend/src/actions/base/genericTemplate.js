import axios from 'axios';
import { createActions, handleActions } from 'redux-actions';
import { call, all, put, select, takeLatest } from 'redux-saga/effects';

export const RestActions = [
  'FIND',
  'FIND_SUCCESS',

  'GET',
  'GET_SUCCESS',

  'CREATE',
  'CREATE_SUCCESS',

  'UPDATE',
  'UPDATE_SUCCESS',

  'REMOVE',
  'REMOVE_SUCCESS',

  'ERROR'
];

export class GenericRestTemplate {
  constructor (name, baseUrl, stateName) {
    this.name = name;
    this.baseUrl = baseUrl;
    this.stateName = stateName;

    const actionCreators = {
      ...createActions(
        {}, ...[...RestActions, ...this.getCustomIdentityActions()],
        {
          prefix: this.name
        }
      )
    };

    Object.assign(this, actionCreators);

    this.getCustomReducerMap = this.getCustomReducerMap.bind(this);
    this.getCustomSagas = this.getCustomSagas.bind(this);
    this.getCustomIdentityActions = this.getCustomIdentityActions.bind(this);
    this.getCustomDefaultState = this.getCustomDefaultState.bind(this);

    this.saga = this.saga.bind(this);

    this.idSelector = this.idSelector.bind(this);
    this.createStateSelector = this.createStateSelector.bind(this);
    this.findStateSelector = this.findStateSelector.bind(this);
    this.getStateSelector = this.getStateSelector.bind(this);
    this.updateStateSelector = this.updateStateSelector.bind(this);
    this.patchStateSelector = this.patchStateSelector.bind(this);

    this.findHandler = this.findHandler.bind(this);
    this.doFind = this.doFind.bind(this);

    this.getHandler = this.getHandler.bind(this);
    this.doGet = this.doGet.bind(this);

    this.createHandler = this.createHandler.bind(this);
    this.doCreate = this.doCreate.bind(this);

    this.updateHandler = this.updateHandler.bind(this);
    this.doUpdate = this.doUpdate.bind(this);

    this.removeHandler = this.removeHandler.bind(this);
    this.doRemove = this.doRemove.bind(this);
  }

  reducer () {
    return handleActions(
      new Map([
        [this.find, (state, action) => ({
          ...state,
          isFinding: true,
          errorMessage: {},
          findState: action.payload
        })],
        [this.findSuccess, (state, action) => ({
          ...state,
          items: action.payload,
          receivedAt: Date.now(),
          isFinding: false,
          success: true
        })],
        [this.error, (state, action) => ({
          ...state,
          items: [],
          isFinding: false,
          isGetting: false,
          isCreating: false,
          isUpdating: false,
          isRemoving: false,
          success: false,
          errorMessage: action.payload
        })],
        [this.get, (state, action) => ({
          ...state,
          item: null,
          isGetting: true,
          id: action.payload.id || action.payload,
          getState: action.payload.state || null
        })],
        [this.getSuccess, (state, action) => ({
          ...state,
          item: action.payload,
          isGetting: false,
          success: true
        })],
        [this.create, (state, action) => ({
          ...state,
          createState: action.payload,
          isCreating: true,
          errorMessage: {}
        })],
        [this.createSuccess, (state, action) => ({
          ...state,
          item: action.payload,
          createState: null,
          receivedAt: Date.now(),
          isCreating: false,
          success: true
        })],
        [this.update, (state, action) => ({
          ...state,
          id: action.payload.id,
          updateState: action.payload.state,
          updateUsingPatch: action.payload.patch || false,
          isUpdating: true,
          errorMessage: {}
        })],
        [this.updateSuccess, (state, action) => ({
          ...state,
          item: action.payload,
          updateState: null,
          receivedAt: Date.now(),
          isUpdating: false,
          success: true
        })],
        [this.remove, (state, action) => ({
          ...state,
          id: action.payload.id,
          isRemoving: true,
          errorMessage: {}
        })],
        [this.removeSuccess, (state, action) => ({
          ...state,
          receivedAt: Date.now(),
          isRemoving: false,
          success: true
        })],
        ...this.getCustomReducerMap()
      ]),
      {
        items: [],
        item: null,
        id: null,
        isFinding: false,
        isGetting: false,
        isCreating: false,
        isUpdating: false,
        isRemoving: false,
        updateUsingPatch: false,
        success: false,
        errorMessage: {},
        validationErrors: {},
        ...this.getCustomDefaultState()
      }
    );
  }

  // override this to register custom actions
  getCustomIdentityActions () {
    return [];
  }

  // override this to register custom reductions
  getCustomReducerMap () {
    return [];
  }

  // sagas
  getCustomSagas () {
    return [];
  }

  // to add something to the state tree
  getCustomDefaultState () {
    return {};
  }

  idSelector () {
    const sn = this.stateName;

    return state => (state.rootReducer[sn].id);
  }

  createStateSelector () {
    const sn = this.stateName;

    return state => (state.rootReducer[sn].createState);
  }

  findStateSelector () {
    const sn = this.stateName;

    return state => (state.rootReducer[sn].findState);
  }

  getStateSelector () {
    const sn = this.stateName;

    return state => (state.rootReducer[sn].getState);
  }

  updateStateSelector () {
    const sn = this.stateName;

    return state => (state.rootReducer[sn].updateState);
  }

  patchStateSelector () {
    const sn = this.stateName;

    return state => (state.rootReducer[sn].updateUsingPatch);
  }

  doFind (data = null) {
    return axios.get(this.baseUrl, { params: data });
  }

  * findHandler () {
    const data = yield (select(this.findStateSelector()));

    try {
      const response = yield call(this.doFind, data);
      yield put(this.findSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  doGet (id, data = null) {
    return axios.get(`${this.baseUrl}/${id}`, { params: data });
  }

  * getHandler () {
    const id = yield (select(this.idSelector()));
    const data = yield (select(this.getStateSelector()));

    try {
      const response = yield call(this.doGet, id, data);
      yield put(this.getSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  doUpdate (id, data, patch = false) {
    if (patch) {
      return axios.patch(`${this.baseUrl}/${id}`, data);
    }

    return axios.put(`${this.baseUrl}/${id}`, data);
  }

  * updateHandler () {
    const id = yield (select(this.idSelector()));
    const data = yield (select(this.updateStateSelector()));
    const patch = yield (select(this.patchStateSelector()));

    try {
      const response = yield call(this.doUpdate, id, data, patch);
      yield put(this.updateSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  doRemove (id) {
    return axios.delete(`${this.baseUrl}/${id}`);
  }

  * removeHandler () {
    const id = yield (select(this.idSelector()));
    try {
      const response = yield call(this.doRemove, id);
      yield put(this.removeSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  doCreate (data) {
    return axios.post(`${this.baseUrl}`, data);
  }

  * createHandler () {
    const data = yield (select(this.createStateSelector()));

    try {
      const response = yield call(this.doCreate, data);
      yield put(this.createSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  * saga () {
    yield all([
      takeLatest(this.find, this.findHandler),
      takeLatest(this.get, this.getHandler),
      takeLatest(this.create, this.createHandler),
      takeLatest(this.update, this.updateHandler),
      takeLatest(this.remove, this.removeHandler),
      ...this.getCustomSagas()
    ]);
  }
}

export default GenericRestTemplate;
