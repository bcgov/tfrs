import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, withRouter, Switch } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

// import createHistory from 'history/createHashHistory'; // 'history/createHashHistory' for  '#'
import * as Routes from './constants/routes';
import store from './store/store';

import App from './app/App';
import history from './app/History';
import './app/FontAwesome';
import Dashboard from './components/dashboard/Dashboard';
import Organizations from './components/organizations/Organizations';
import AccountActivity from './components/account_activity/AccountActivity';
import CreditTransfer from './components/account_activity/CreditTransfer';
import CreditTransferNew from './components/account_activity/CreditTransferNew';
import Notifications from './components/notifications/Notifications';
import Administration from './components/administration/Administration';
import Settings from './components/settings/Settings';
import OrganizationDetails from './components/organizations/OrganizationDetails';
import NotFound from './components/reusables/NotFound';
import CreditTransactionsContainer from './credit_transfers/CreditTransactionsContainer';
import CreditTransferAddContainer from './credit_transfers/CreditTransferAddContainer';
import CreditTransferViewContainer from './credit_transfers/CreditTransferViewContainer';

import { getLoggedInUser } from './actions/userActions';

// TODO: Move Routes to Routes.jsx

import '../styles/index.scss';

// const history = createHistory();

store.dispatch(getLoggedInUser());

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history} key={Math.random()}>
      <div>
        <App>
          <Switch>
            <Route
              exact
              path={Routes.HOME}
              component={withRouter(Dashboard)}
            />
            <Route
              exact
              path={Routes.ORGANIZATIONS}
              component={withRouter(Organizations)}
            />
            <Route
              path={Routes.ORGANIZATION_DETAILS}
              component={withRouter(OrganizationDetails)}
            />
            <Route
              path={Routes.ACCOUNT_ACTIVITY}
              component={withRouter(AccountActivity)}
            />
            <Route
              path={Routes.CREDIT_TRANSFER_DETAILS}
              component={withRouter(CreditTransfer)}
            />

            <Route
              exact
              path={Routes.CREDIT_TRANSFER}
              component={withRouter(CreditTransferNew)}
            />
            <Route
              path={Routes.NOTIFICATIONS}
              component={withRouter(Notifications)}
            />
            <Route
              path={Routes.ADMINISTRATION}
              component={withRouter(Administration)}
            />
            <Route path={Routes.SETTINGS} component={withRouter(Settings)} />
            <Route
              exact
              path={Routes.CREDIT_TRANSACTIONS}
              component={withRouter(CreditTransactionsContainer)}
            />
            <Route
              path={Routes.CREDIT_TRANSACTION_DETAILS}
              component={withRouter(CreditTransferViewContainer)}
            />
            <Route
              exact
              path={Routes.CREDIT_TRANSACTIONS_ADD}
              component={withRouter(CreditTransferAddContainer)}
            />
            <Route component={NotFound} />
          </Switch>
        </App>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
