import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { createLogger } from 'redux-logger'
import { reducer as toastrReducer } from 'react-redux-toastr'
// import createSocketIoMiddleware from 'redux-socket.io'
// import io from 'socket.io-client'

import rootReducer from '../reducers/reducer'
// import { SOCKETIO_URL } from '../constants/routes'

import CONFIG from '../config'
import keycloakReducer from '../reducers/keycloakReducer'
import rootSaga from '../reducers/rootSaga'

export const sagaMiddleware = createSagaMiddleware()

// const socket = io(SOCKETIO_URL)
// const socketIoMiddleware = createSocketIoMiddleware(socket, 'socketio/')

const userAuthPersistConfig = {
  key: 'userAuth',
  storage
}

const combinedReducers = combineReducers({
  toastr: toastrReducer,
  userAuth: persistReducer(userAuthPersistConfig, keycloakReducer),
  rootReducer
})

const allMiddleware = [
  // socketIoMiddleware,
  sagaMiddleware,
  thunk
]

if (CONFIG.DEBUG.ENABLED) {
  allMiddleware.push(createLogger())
}

const store = configureStore({
  reducer: combinedReducers,
  middleware: [...allMiddleware]
})

sagaMiddleware.run(rootSaga)

export default store
