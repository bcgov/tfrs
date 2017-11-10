import * as ActionTypes from '../constants/actionTypes.jsx';
import * as ReducerTypes from '../constants/reducerTypes.jsx';
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

const genericRequest = (state = {
    isFetching: false,
    data: [],
    success: false,
    errorMessage: [],
}, action) => {
    switch (action.type) {
        case ActionTypes.REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                success: false,
            })
        case ActionTypes.SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                success: true,
                data: action.data,
            })
        case ActionTypes.ERROR:
            return Object.assign({}, state, {
                isFetching: false,
                success: false,
                errorMessage: action.errorMessage,
            })
        case ActionTypes.RESET:
            return Object.assign({}, state, {
                isFetching: false,
                data: [],
                success: false,
                errorMessage: [],
            })
        default: return state
    }
}

function createReducer(reducerFunction, reducerName) {
    return (state, action) => {
        const { name } = action;
        const isInitializationCall = state === undefined;
        if (name !== reducerName && !isInitializationCall) return state;
        return reducerFunction(state, action);
    }
}

const rootReducer = combineReducers({
    [ReducerTypes.GET_ACCOUNT_ACTIVITY]: createReducer(genericRequest, ReducerTypes.GET_ACCOUNT_ACTIVITY),
    [ReducerTypes.ACCEPT_CREDIT_TRANSFER]: createReducer(genericRequest, ReducerTypes.ACCEPT_CREDIT_TRANSFER),
    [ReducerTypes.GET_FUEL_SUPPLIERS]: createReducer(genericRequest, ReducerTypes.GET_FUEL_SUPPLIERS),
    [ReducerTypes.GET_FUEL_SUPPLIER]: createReducer(genericRequest, ReducerTypes.GET_FUEL_SUPPLIER),
    [ReducerTypes.SEARCH_FUEL_SUPPLIERS]: createReducer(genericRequest, ReducerTypes.SEARCH_FUEL_SUPPLIERS),
    [ReducerTypes.ADD_FUEL_SUPPLIER]: createReducer(genericRequest, ReducerTypes.ADD_FUEL_SUPPLIER),
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
    [ReducerTypes.FUEL_SUPPLIER_ACTION_TYPE]: createReducer(genericRequest, ReducerTypes.FUEL_SUPPLIER_ACTION_TYPE),
    [ReducerTypes.FUEL_SUPPLIER_ACTION_TYPES]: createReducer(genericRequest, ReducerTypes.FUEL_SUPPLIER_ACTION_TYPES),
    [ReducerTypes.FUEL_SUPPLIER_STATUSES]: createReducer(genericRequest, ReducerTypes.FUEL_SUPPLIER_STATUSES),
    [ReducerTypes.FUEL_SUPPLIER_STATUS]: createReducer(genericRequest, ReducerTypes.FUEL_SUPPLIER_STATUS),
    [ReducerTypes.FUEL_SUPPLIER_TYPES]: createReducer(genericRequest, ReducerTypes.FUEL_SUPPLIER_TYPES),
    [ReducerTypes.FUEL_SUPPLIER_TYPE]: createReducer(genericRequest, ReducerTypes.FUEL_SUPPLIER_TYPE),
    [ReducerTypes.FUEL_SUPPLIER_CONTACTS]: createReducer(genericRequest, ReducerTypes.FUEL_SUPPLIER_CONTACTS),
    [ReducerTypes.FUEL_SUPPLIER_ATTACHMENTS]: createReducer(genericRequest, ReducerTypes.FUEL_SUPPLIER_ATTACHMENTS),
    [ReducerTypes.USERS]: createReducer(genericRequest, ReducerTypes.USERS),
    [ReducerTypes.PERMISSIONS]: createReducer(genericRequest, ReducerTypes.PERMISSIONS),
    [ReducerTypes.ROLE_PERMISSIONS]: createReducer(genericRequest, ReducerTypes.ROLE_PERMISSIONS),
    [ReducerTypes.ROLES]: createReducer(genericRequest, ReducerTypes.ROLES),    
    [ReducerTypes.USER_ROLES]: createReducer(genericRequest, ReducerTypes.USER_ROLES),    
    [ReducerTypes.CREDIT_TRADE_STATUSES]: createReducer(genericRequest, ReducerTypes.CREDIT_TRADE_STATUSES),    
    [ReducerTypes.CREDIT_TRADE_TYPES]: createReducer(genericRequest, ReducerTypes.CREDIT_TRADE_TYPES),    
    routing, 
});
export default rootReducer;
