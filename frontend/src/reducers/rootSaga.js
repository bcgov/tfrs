import store, { sagaMiddleware } from '../store/store'
import { take } from 'redux-saga/effects'
import { REHYDRATE } from 'redux-persist/lib/constants'

import authenticationStateSaga from '../store/authenticationState'
import notificationsSaga from '../store/notificationTrigger'
import socketAuthenticationSaga from '../store/socketAuthentication'
import autocompleteInvalidatorSaga from '../store/autocompleteInvalidator'
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
import autosaveSaga from '../store/autosaveStore'
import { complianceReporting } from '../actions/complianceReporting'
import { exclusionReports } from '../actions/exclusionReports'

function * rootSaga () {
  console.log('Waiting for rehydration')
  yield take(REHYDRATE) // Wait for rehydrate to prevent sagas from running with empty store
  console.log('Rehydrated')

  // sagaMiddleware.run(sessionTimeoutSaga) // TODO fix sessiontimeout with new keycloak login
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
}

export default rootSaga
