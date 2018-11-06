import createHistory from 'history/createBrowserHistory'; // 'history/createHashHistory' for  '#'

let config = {};

/* global __BUILD_NUMBER__ */

if (__BUILD_NUMBER__ && window.location.host === 'dev-lowcarbonfuels.pathfinder.gov.bc.ca') {
  console.log(__BUILD_NUMBER__);
  config = {
    basename: `/${__BUILD_NUMBER__}`
  };
}

const history = createHistory(config);

export default history;
