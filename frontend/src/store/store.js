import createSagaMiddleware from 'redux-saga'
import { compose } from 'redux'
import thunk from 'redux-thunk'
import { configureStore } from '@reduxjs/toolkit'
import persistState from 'redux-localstorage'
import { createLogger } from 'redux-logger'
import createSocketIoMiddleware from 'redux-socket.io'
import { reducer as toastrReducer } from 'react-redux-toastr'
import io from 'socket.io-client'

import rootReducer from '../reducers/reducer'
import { SOCKETIO_URL } from '../constants/routes'

import { persistTargetPathReducer } from '../reducers/persistTargetPathReducer'

import CONFIG from '../config'
// import sessionTimeoutSaga from './sessionTimeout'
import authenticationStateSaga from './authenticationState'
import notificationsSaga from './notificationTrigger'
import socketAuthenticationSaga from './socketAuthentication'
import autocompleteInvalidatorSaga from './autocompleteInvalidator'
import { carbonIntensities } from '../actions/carbonIntensities'
import { defaultCarbonIntensities } from '../actions/defaultCarbonIntensities'
import { energyDensities } from '../actions/energyDensities'
import { energyEffectivenessRatios } from '../actions/energyEffectivenessRatios'
import { expectedUses } from '../actions/expectedUses'
import { fuelClasses } from '../actions/fuelClasses'
import { notionalTransferTypes } from '../actions/notionalTransferTypes'
import { petroleumCarbonIntensities } from '../actions/petroleumCarbonIntensities'
import { transactionTypes } from '../actions/transactionTypes'
import { roles } from '../actions/roleActions'
import autosaveSaga from './autosaveStore'
import { complianceReporting } from '../actions/complianceReporting'
import { exclusionReports } from '../actions/exclusionReports'

const sagaMiddleware = createSagaMiddleware()

const socket = io(SOCKETIO_URL)
const socketIoMiddleware = createSocketIoMiddleware(socket, 'socketio/')

const enhancer = compose(persistState(['targetPath'], { key: 'tfrs-state' }))

const combinedReducers = (state = {}, action) => {
  const currentRoute = state.routing || {}
  return {
    toastr: toastrReducer(state.toastr, action),
    targetPath: persistTargetPathReducer(state.targetPath, { ...action, currentRoute }),
    rootReducer: rootReducer(state.rootReducer, action)
  }
}

const allMiddleware = [
  socketIoMiddleware,
  sagaMiddleware,
  thunk
]

if (CONFIG.DEBUG.ENABLED) {
  allMiddleware.push(createLogger())
}

const store = configureStore({
  reducer: combinedReducers,
  middleware: [...allMiddleware],
  enhancers: [enhancer]
})

// sagaMiddleware.run(sessionTimeoutSaga); // TODO fix sessiontimeout with new keycloak login
sagaMiddleware.run(notificationsSaga, store)
sagaMiddleware.run(authenticationStateSaga, store)
sagaMiddleware.run(socketAuthenticationSaga, store)
sagaMiddleware.run(autocompleteInvalidatorSaga, store)
sagaMiddleware.run(autosaveSaga)

sagaMiddleware.run(roles.saga)
sagaMiddleware.run(complianceReporting.saga)
sagaMiddleware.run(exclusionReports.saga)
sagaMiddleware.run(carbonIntensities.saga)
sagaMiddleware.run(defaultCarbonIntensities.saga)
sagaMiddleware.run(energyDensities.saga)
sagaMiddleware.run(energyEffectivenessRatios.saga)
sagaMiddleware.run(expectedUses.saga)
sagaMiddleware.run(fuelClasses.saga)
sagaMiddleware.run(notionalTransferTypes.saga)
sagaMiddleware.run(petroleumCarbonIntensities.saga)
sagaMiddleware.run(transactionTypes.saga)

export default store
