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
    routing, 
});
export default rootReducer;
