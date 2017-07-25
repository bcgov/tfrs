import React from 'react';
import  ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { Route, withRouter } from 'react-router'
import { push, ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory'; // 'history/createHashHistory' for  '#'
import * as Routes from './constants/routes.jsx';
import store from './store/store.jsx';

import Login from './components/Login.jsx';
import App from './components/App.jsx';

import '../styles/index.scss';

const history = createHistory();

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))
ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history} key={Math.random()}>
			<div>
				<Route exact path={Routes.HOME} component={withRouter(App)} key={Math.random()} />
				<Route path={Routes.LOGIN} component={withRouter(Login)} key={Math.random()}/> 
			</div>  
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
)
