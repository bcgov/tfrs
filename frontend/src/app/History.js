import createHistory from 'history/createHashHistory'; // 'history/createHashHistory' for  '#'
// TODO: Change to 'history/createBrowserHistory' but web server should route all /* (except /api/*) back to the front-end client

const history = createHistory();
export default history;
