import { createBrowserHistory } from 'history'

let config = {}

/* global __BUILD_NUMBER__ */

let build = null

if (Object.keys(global).includes('__BUILD_NUMBER__')) {
  build = __BUILD_NUMBER__
}

if (build && window.location.host === 'dev-lowcarbonfuels.pathfinder.gov.bc.ca') {
  config = {
    basename: `/${__BUILD_NUMBER__}`
  }
}

const history = createBrowserHistory(config)

export default history
