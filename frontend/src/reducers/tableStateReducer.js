import ActionTypes from "../constants/actionTypes/Tables";

const tableState = (state = {
  savedState: {
  },
}, action) => {
  switch (action.type) {
    case ActionTypes.SAVE_TABLE_STATE:
      let newState =  {
        ...state,
        savedState: {
          ...state.savedState,
        }
      };
      newState.savedState[action.key] = action.data;
      return newState;
    default:
      return state;
  }
};

export default tableState;