import React from 'react';
import  ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { Route, withRouter, Switch } from 'react-router'
import { push, ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory'; // 'history/createHashHistory' for  '#'
import * as Routes from './constants/routes.jsx';
import store from './store/store.jsx';

import App from './components/App.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import FuelSuppliers from './components/fuel_suppliers/FuelSuppliers.jsx';
import AccountActivity from './components/account_activity/AccountActivity.jsx';
import CreditTransfer from './components/account_activity/CreditTransfer.jsx';
import Opportunities from './components/opportunities/Opportunities.jsx';
import Notifications from './components/notifications/Notifications.jsx';
import Administration from './components/administration/Administration.jsx';
import Settings from './components/settings/Settings.jsx';
import FuelSupplierDetails from './components/fuel_suppliers/FuelSupplierDetails.jsx';

import '../styles/index.scss';

const history = createHistory();

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history} key={Math.random()}>
			<div>
				<App>
					<Switch>
						<Route exact path={Routes.HOME} component={withRouter(Dashboard)} />
						<Route exact path={Routes.FUEL_SUPPLIERS} component={withRouter(FuelSuppliers)} />
						<Route path={Routes.FUEL_SUPPLIER_DETAILS} component={withRouter(FuelSupplierDetails)} />
						<Route path={Routes.ACCOUNT_ACTIVITY} component={withRouter(AccountActivity)} />
						<Route path={Routes.CREDIT_TRANSFER_DETAILS} component={withRouter(CreditTransfer)} />
						<Route exact path={Routes.CREDIT_TRANSFER} component={withRouter(CreditTransfer)} />
						<Route path={Routes.OPPORTUNITIES} component={withRouter(Opportunities)} />
						<Route path={Routes.NOTIFICATIONS} component={withRouter(Notifications)} />									
						<Route path={Routes.ADMINISTRATION} component={withRouter(Administration)} />		
						<Route path={Routes.SETTINGS} component={withRouter(Settings)} />																
					</Switch>
				</App> 
			</div>
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
)