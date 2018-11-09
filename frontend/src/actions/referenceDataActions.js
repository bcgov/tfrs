import axios from 'axios';

import ActionTypes from '../constants/actionTypes/ReferenceData';
import ReducerTypes from '../constants/reducerTypes/ReferenceData';
import * as Routes from '../constants/routes';

const getReferenceData = () => (dispatch) => {
  dispatch(getReferenceDataRequest());

  let referenceData = {};
  Promise.all(
    Object.keys(Routes.REFERENCE_DATA_API_ENDPOINTS).map( stateName =>
      axios.get(Routes.BASE_URL + Routes.REFERENCE_DATA_API_ENDPOINTS[stateName]).then((response =>
      referenceData[stateName] = response.data))
    )
  ).then(
    dispatch(getReferenceDataSuccess(referenceData))
  ).catch( error =>
    dispatch(getReferenceDataError(error.response))
  );

};

const getReferenceDataRequest = () => ({
  name: ReducerTypes.REFERENCE_DATA,
  type: ActionTypes.GET_REFERENCE_DATA
});

const getReferenceDataSuccess = data => ({
  name: ReducerTypes.REFERENCE_DATA,
  type: ActionTypes.RECEIVE_REFERENCE_DATA,
  data
});

const getReferenceDataError = error => ({
  name: ReducerTypes.REFERENCE_DATA,
  type: ActionTypes.ERROR_RECEIVE_REFERENCE_DATA,
  errorMessage: error
});

export { getReferenceData };
