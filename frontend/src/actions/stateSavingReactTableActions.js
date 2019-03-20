import ActionTypes from '../constants/actionTypes/Tables';
import ReducerTypes from '../constants/reducerTypes/Tables';

const saveTableState = (key, data) => (dispatch) => {
  dispatch(saveTableStateAction(key, data));
};

const saveTableStateAction = (key, data) => ({
  key: key,
  data: data,
    name: ReducerTypes.SAVE_TABLE_STATE,
    type: ActionTypes.SAVE_TABLE_STATE,
});

export default saveTableState;
