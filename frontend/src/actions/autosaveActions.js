import {createAction} from "redux-actions";

export const loadAutosaveData = createAction('LOAD_AUTOSAVE_DATA');
export const saveAutosaveData = createAction('SAVE_AUTOSAVE_DATA');
export const clearAutosaveData = createAction('CLEAR_AUTOSAVE_DATA');
