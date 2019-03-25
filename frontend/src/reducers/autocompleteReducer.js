import ActionTypes from '../constants/actionTypes/Autocomplete';

const autocomplete = (state = {
  serial: Math.floor(Math.random() * 1000000 )
}, action) => {
  switch (action.type) {
    case ActionTypes.INVALIDATE_AUTOCOMPLETE_CACHE:
      return {
        ...state,
        serial: Math.floor(Math.random() * 1000000 )
      }
    default:
      return state;
  }
};


export { autocomplete };
