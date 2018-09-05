import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import App from './app/App';
import history from './app/History';

/* global __LOGOUT_URL__, __LOGOUT_TEST_URL__ */
import * as Routes from './constants/routes';
import { CREDIT_TRANSACTIONS_HISTORY, HISTORICAL_DATA_ENTRY, USERS as ADMIN_USERS } from './constants/routes/Admin';
import CONTACT_US from './constants/routes/ContactUs';
import CREDIT_TRANSACTIONS from './constants/routes/CreditTransactions';
import ORGANIZATIONS from './constants/routes/Organizations';
import USERS from './constants/routes/Users';

import CreditTransactionsHistory from './admin/credit_trade_history/CreditTradeHistoryContainer';
import HistoricalDataEntryContainer from './admin/historical_data_entry/HistoricalDataEntryContainer';
import HistoricalDataEntryEditContainer from './admin/historical_data_entry/HistoricalDataEntryEditContainer';
import UsersContainer from './admin/users/UsersContainer';
import NotFound from './app/components/NotFound';
import ContactUsContainer from './contact_us/ContactUsContainer';
import CreditTransactionsContainer from './credit_transfers/CreditTransactionsContainer';
import CreditTransferAddContainer from './credit_transfers/CreditTransferAddContainer';
import CreditTransferEditContainer from './credit_transfers/CreditTransferEditContainer';
import CreditTransferViewContainer from './credit_transfers/CreditTransferViewContainer';
import MyOrganizationContainer from './organizations/MyOrganizationContainer';
import OrganizationsContainer from './organizations/OrganizationsContainer';
import OrganizationViewContainer from './organizations/OrganizationViewContainer';
import SettingsContainer from './settings/SettingsContainer';
import UserViewContainer from './users/UserViewContainer';
import NotificationContainer from './notifications/NotificationContainer';

const Router = props => (
  <ConnectedRouter history={history} key={Math.random()}>
    <App>
      <Switch>
        <Route
          exact
          path={Routes.HOME}
          component={withRouter(CreditTransactionsContainer)}
        />
        <Route
          exact
          path={Routes.LOGOUT}
          component={() => {
            const logoutUrl = (window.location.host === 'dev.lowcarbonfuels.gov.bc.ca' ||
            window.location.host === 'test.lowcarbonfuels.gov.bc.ca')
              ? `${__LOGOUT_TEST_URL__}?returl=${window.location.origin}`
              : `${__LOGOUT_URL__}?returl=${window.location.origin}`;

            window.location = logoutUrl;
          }}
        />
        <Route
          exact
          path={Routes.SETTINGS}
          component={withRouter(SettingsContainer)}
        />
        <Route
          exact
          path={ORGANIZATIONS.LIST}
          component={withRouter(OrganizationsContainer)}
        />
        <Route
          path={ORGANIZATIONS.DETAILS}
          component={withRouter(OrganizationViewContainer)}
        />
        <Route
          exact
          path={ORGANIZATIONS.MINE}
          component={withRouter(MyOrganizationContainer)}
        />
        <Route
          exact
          path={CREDIT_TRANSACTIONS.LIST}
          component={withRouter(CreditTransactionsContainer)}
        />
        <Route
          path={CREDIT_TRANSACTIONS.HIGHLIGHT}
          component={withRouter(CreditTransactionsContainer)}
        />
        <Route
          path={CREDIT_TRANSACTIONS.DETAILS}
          component={withRouter(CreditTransferViewContainer)}
        />
        <Route
          exact
          path={CREDIT_TRANSACTIONS.ADD}
          component={withRouter(CreditTransferAddContainer)}
        />
        <Route
          path={CREDIT_TRANSACTIONS.EDIT}
          component={withRouter(CreditTransferEditContainer)}
        />
        <Route
          exact
          path={HISTORICAL_DATA_ENTRY.LIST}
          component={withRouter(HistoricalDataEntryContainer)}
        />
        <Route
          path={HISTORICAL_DATA_ENTRY.EDIT}
          component={withRouter(HistoricalDataEntryEditContainer)}
        />
        <Route
          path={USERS.DETAILS}
          component={withRouter(UserViewContainer)}
        />
        <Route
          exact
          path={CONTACT_US.DETAILS}
          component={withRouter(ContactUsContainer)}
        />
        <Route
          exact
          path={CREDIT_TRANSACTIONS_HISTORY.LIST}
          component={withRouter(CreditTransactionsHistory)}
        />
        <Route
          exact
          path={ADMIN_USERS.LIST}
          component={withRouter(UsersContainer)}
        />
        <Route
          path={ADMIN_USERS.DETAILS}
          component={withRouter(UserViewContainer)}
        />
        <Route
          exact
          path={Routes.NOTIFICATIONS.LIST}
          component={withRouter(NotificationContainer)}
        />
        <Route component={NotFound} />
      </Switch>
    </App>
  </ConnectedRouter>
);

export default Router;
