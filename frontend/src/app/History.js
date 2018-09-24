import createHistory from 'history/createBrowserHistory'; // 'history/createHashHistory' for  '#'

let config = {};

if (process.env.BASE_PATH) {
  config = {
    basename: process.env.BASE_PATH
  };
}

const history = createHistory(config);

export default history;
