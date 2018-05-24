import ActionTypes from '../constants/actionTypes/SigningAuthorityAssertions';

const signingAuthorityAssertions = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_SIGNING_AUTHORITY_ASSERTIONS:
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_SIGNING_AUTHORITY_ASSERTIONS:
      return {
        ...state,
        isFetching: false,
        items: action.data,
        success: true
      };
    case ActionTypes.ERROR_SIGNING_AUTHORITY_ASSERTIONS:
      return {
        ...state,
        errorMessage: action.errorMessage,
        isFetching: false,
        success: false
      };
    default:
      return state;
  }
};

export default signingAuthorityAssertions;
