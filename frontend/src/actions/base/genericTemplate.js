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

  'PATCH',
  'PATCH_SUCCESS',

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
      ...createActions({
      }, ...[
        ...RestActions,
        ...this.getCustomIdentityActions()
      ], {
        prefix: this.name
      })
    };

    Object.assign(this, actionCreators);

    this.getCustomReducerMap = this.getCustomReducerMap.bind(this);
    this.getCustomSagas = this.getCustomSagas.bind(this);
    this.getCustomIdentityActions = this.getCustomIdentityActions.bind(this);
    this.getCustomDefaultState = this.getCustomDefaultState.bind(this);

    this.saga = this.saga.bind(this);

    this.idSelector = this.idSelector.bind(this);

    this.findHandler = this.findHandler.bind(this);
    this.doFind = this.doFind.bind(this);

    this.getHandler = this.getHandler.bind(this);
    this.doGet = this.doGet.bind(this);
  }

  reducer () {
    return handleActions(
      new Map([
        [this.find, (state, action) => ({
          ...state,
          isFetching: true,
          errorMessage: []
        })],
        [this.findSuccess, (state, action) => ({
          ...state,
          items: action.payload,
          receivedAt: Date.now(),
          isFetching: false,
          success: true
        })],
        [this.error, (state, action) => ({
          ...state,
          items: [],
          isFetching: false,
          success: false,
          errorMessage: action.payload
        })],
        [this.get, (state, action) => ({
          ...state,
          item: {},
          isFetching: true,
          id: action.payload
        })],
        [this.getSuccess, (state, action) => ({
          ...state,
          item: action.payload,
          isFetching: false,
          success: true
        })],
        ...this.getCustomReducerMap()
      ]),
      {
        items: [],
        item: null,
        id: null,
        isFetching: false,
        success: false,
        errorMessage: [],
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
    return state => (state.rootReducer[this.stateName].id);
  }

  doFind () {
    return axios.get(this.baseUrl);
  }

  * findHandler () {
    try {
      const response = yield call(this.doFind);
      yield put(this.findSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  doGet (id) {
    return axios.get(`${this.baseUrl}/${id}`);
  }

  * getHandler () {
    const id = yield (select(this.idSelector()));
    try {
      const response = yield call(this.doGet, id);
      yield put(this.getSuccess(response.data));
    } catch (error) {
      yield put(this.error(error.response.data));
    }
  }

  * saga () {
    yield all([
      takeLatest(this.find, this.findHandler),
      takeLatest(this.get, this.getHandler),
      ...this.getCustomSagas()
    ]);
  }
}

export default GenericRestTemplate;
