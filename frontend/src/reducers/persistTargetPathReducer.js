const persistTargetPathReducer = (state = {
  target: '/'
}, action) => {
  switch (action.type) {
    case 'redux-oidc/LOADING_USER':
      if (action.currentRoute.location &&
        !(action.currentRoute.location.pathname.match(/.*?authCallback/))) {
        return {
          ...state,
          target: action.currentRoute.location.pathname
        };
      }
      else {
        return state;
      }
    default:
      return state;
  }
};

export {persistTargetPathReducer};