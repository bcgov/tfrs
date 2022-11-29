import ActionTypes from '../constants/actionTypes/DocumentUploads'

const documentUpload = (state = {
  isFetching: false,
  success: false,
  errors: {},
  item: {},
  count: {
    isFetching: false,
    unreadCount: null
  },
  itemsCount: 0
}, action) => {
  switch (action.type) {
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        errors: {}
      }
    case ActionTypes.GET_REQUEST:
      return {
        ...state,
        isFetching: true,
        item: action.data,
        success: false
      }
    case ActionTypes.RECEIVE_REQUEST:
      return {
        ...state,
        errors: {},
        isFetching: false,
        item: action.data,
        success: true,
        itemsCount: action.totalCount
      }
    case ActionTypes.ERROR:
      return {
        ...state,
        errors: action.errorMessage,
        isFetching: false,
        success: false
      }
    default:
      return state
  }
}

const documentUploads = (state = {
  items: [],
  isFetching: false,
  success: false,
  item: {},
  itemsCount: 0,
  errorMessage: []
}, action) => {
  switch (action.type) {
    case ActionTypes.GET_REQUESTS:
      return {
        ...state,
        isFetching: true,
        success: false
      }
    case ActionTypes.RECEIVE_REQUESTS:
      return {
        ...state,
        isFetching: false,
        items: action.data,
        success: true,
        itemsCount: action.totalCount
      }
    case ActionTypes.ERROR:
      return {
        ...state,
        errorMessage: action.errorMessage,
        isFetching: false,
        success: false
      }
    default:
      return state
  }
}

export { documentUpload, documentUploads }
