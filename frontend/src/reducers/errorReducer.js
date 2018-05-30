const errorRequest = (state = {
  errorMessage: {},
  hasErrors: false
}, action) => {
  switch (action.type) {
    case 'ERROR':
      return {
        ...state,
        errorMessage: action.errorMessage,
        hasErrors: true
      };
    case '@@router/LOCATION_CHANGE':
      return {
        ...state,
        errorMessage: {},
        hasErrors: false
      };
    default:
      return state;
  }
};

export default errorRequest;
