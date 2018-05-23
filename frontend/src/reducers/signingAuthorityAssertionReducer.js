import ActionTypes from '../constants/actionTypes/SigningAuthorityAssertions';

const signingAuthorityAssertions = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_SIGNING_AUTHORITY_ASSERTIONS:
      return Object.assign({}, state, {
        isFetching: true,
        success: false
      });
    case ActionTypes.RECEIVE_SIGNING_AUTHORITY_ASSERTIONS:
      return Object.assign({}, state, {
        isFetching: false,
        success: true,
        items: action.data
      });
    case ActionTypes.ERROR_SIGNING_AUTHORITY_ASSERTIONS:
      return Object.assign({}, state, {
        isFetching: false,
        success: false,
        errorMessage: action.errorMessage
      });
    default:
      return state;
  }
};

export default signingAuthorityAssertions;
