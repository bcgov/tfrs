import createHistory from 'history/createBrowserHistory'; // 'history/createHashHistory' for  '#'

let config = {};

if (process.env.BASE_PATH && window.location.host === 'dev-lowcarbonfuels.pathfinder.gov.bc.ca') {
  config = {
    basename: process.env.BASE_PATH
  };
}

const history = createHistory(config);

export default history;
