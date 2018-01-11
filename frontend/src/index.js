import React from 'react';
import  ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { Route, withRouter, Switch } from 'react-router'
import { push, ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createHashHistory'; // 'history/createHashHistory' for  '#'
import * as Routes from './constants/routes.jsx';
import store from './store/store.jsx';
import {
	getOrganizationActionTypes,
	getOrganizationStatuses,
	getOrganizationTypes,
	getOrganizationContacts,
	getOrganizationAttachments,
	getOrganizations
} from './actions/organizationActions.jsx';
import { 
	getUsers,
	getPermissions,
	getRolePermissions,
	getRoles,
	getUserRoles
 } from './actions/userActions.jsx';
import { 
	getCreditTrades,
	getCreditTradeStatuses,
	getCreditTradeTypes
	} from './actions/creditTradesActions.jsx';
import {
	getAccountActivity
	} from './actions/accountActivityActions.jsx'
import App from './components/App.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import Organizations from './components/organizations/Organizations.jsx';
import AccountActivity from './components/account_activity/AccountActivity.jsx';
import CreditTransfer from './components/account_activity/CreditTransfer.jsx';
import CreditTransferNew from './components/account_activity/CreditTransferNew.jsx'
import Notifications from './components/notifications/Notifications.jsx';
import Administration from './components/administration/Administration.jsx';
import Settings from './components/settings/Settings.jsx';
import OrganizationDetails from './components/organizations/OrganizationDetails.jsx';
import NotFound from './components/reusables/NotFound.jsx';

import '../styles/index.scss';

const history = createHistory();

store.dispatch(getUsers());
store.dispatch(getPermissions());
store.dispatch(getRolePermissions());
store.dispatch(getRoles());
store.dispatch(getUserRoles());
store.dispatch(getCreditTrades());
store.dispatch(getCreditTradeStatuses());
store.dispatch(getCreditTradeTypes());


ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history} key={Math.random()}>
			<div>
				<App>
					<Switch>
						<Route exact path={Routes.HOME} component={withRouter(Dashboard)} />
						<Route exact path={Routes.ORGANIZATIONS} component={withRouter(Organizations)} />
						<Route path={Routes.ORGANIZATION_DETAILS} component={withRouter(OrganizationDetails)} />
						<Route path={Routes.ACCOUNT_ACTIVITY} component={withRouter(AccountActivity)} />
						<Route path={Routes.CREDIT_TRANSFER_DETAILS} component={withRouter(CreditTransfer)} />
						<Route exact path={Routes.CREDIT_TRANSFER} component={withRouter(CreditTransferNew)} />
						<Route path={Routes.NOTIFICATIONS} component={withRouter(Notifications)} />									
						<Route path={Routes.ADMINISTRATION} component={withRouter(Administration)} />		
						<Route path={Routes.SETTINGS} component={withRouter(Settings)} />	
						<Route component={NotFound} />															
					</Switch>
				</App> 
			</div>
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
)