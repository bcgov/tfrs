import ActionTypes from '../constants/actionTypes/Keycloak'

const persistTargetPathReducer = (state = {
  target: '/'
}, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN_KEYCLOAK_USER_SUCCESS:
      console.log('LOGIN_KEYCLOAK_USER_SUCCESS')
      console.log(action)
      const pathname = window.location.pathname

      if (!pathname.match(/.*?authCallback/)) {
        return {
          ...state,
          target: pathname
        };
      }

      return state;

    default:
      return state;
  }
};

export { persistTargetPathReducer };

//TODO check if target path is needed after user login