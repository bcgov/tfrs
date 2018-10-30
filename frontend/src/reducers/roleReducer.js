import ActionTypes from '../constants/actionTypes/Roles';

const roleRequest = (state = {
  didInvalidate: false,
  role: {},
  isFetching: false
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_ROLE:
      return {
        ...state,
        didInvalidate: false,
        role: {},
        isFetching: true
      };
    case ActionTypes.RECEIVE_ROLE:
      return {
        ...state,
        didInvalidate: false,
        role: action.data,
        isFetching: false
      };
    default:
      return state;
  }
};

const roles = (state = {
  items: [],
  isFetching: false,
  success: false,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_ROLES:
      return {
        ...state,
        isFetching: true,
        success: false
      };
    case ActionTypes.RECEIVE_ROLES:
      return {
        ...state,
        isFetching: false,
        items: action.data,
        success: true
      };
    case ActionTypes.ERROR:
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

export { roleRequest, roles };
