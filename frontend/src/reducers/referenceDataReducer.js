import ActionTypes from '../constants/actionTypes/ReferenceData';
import ReducerTypes from "../constants/reducerTypes/ReferenceData";

const referenceData = (state = {
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  if (action.name === ReducerTypes.REFERENCE_DATA) {
    switch (action.type) {
      case ActionTypes.GET_REFERENCE_DATA:
        return {
          ...state,
          isFetching: true,
          success: false
        };
      case ActionTypes.RECEIVE_REFERENCE_DATA:
        return {
          ...state,
          ...action.data,
          isFetching: false,
          success: true
        };
      case ActionTypes.ERROR_RECEIVE_REFERENCE_DATA:
        return {
          ...state,
          errorMessage: action.errorMessage,
          isFetching: false,
          success: false
        };
      default:
        return state;
    }
  } else {
    return state;
  }
};

export {referenceData};
