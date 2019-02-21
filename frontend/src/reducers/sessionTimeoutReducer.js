const sessionTimeout = (state = {
  warning: false,
  expired: false
}, action) => {
  switch (action.type) {
    case 'SESSION_TIMEOUT_RESET':
      return {
        ...state,
        warning: false,
        expired: false
      };
    case 'SESSION_TIMEOUT_WARNING':
      return {
        ...state,
        warning: true,
        expired: false
      };
    case 'SESSION_TIMEOUT_EXPIRED':
      return {
        ...state,
        warning: true,
        expired: true
      };
    default:
      return state;
  }
};

export default sessionTimeout;
