import React from 'react';
import { Route, Switch, withRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

import App from './app/App';
import history from './app/History';

/* global __LOGOUT_URL__, __LOGOUT_TEST_URL__ */
import * as Routes from './constants/routes';
import CONTACT_US from './constants/routes/ContactUs';
import CREDIT_TRANSACTIONS from './constants/routes/CreditTransactions';
import CREDIT_TRANSACTIONS_HISTORY from './constants/routes/CreditTransactionsHistory';
import HISTORICAL_DATA_ENTRY from './constants/routes/HistoricalDataEntry';
import ORGANIZATIONS from './constants/routes/Organizations';
import USERS from './constants/routes/Users';

import ContactUsContainer from './contact_us/ContactUsContainer';
import GovernmentTransferAddContainer from './credit_transfers/GovernmentTransferAddContainer';
import GovernmentTransferEditContainer from './credit_transfers/GovernmentTransferEditContainer';
import GovernmentTransferContainer from './credit_transfers/GovernmentTransferContainer';
import CreditTransactionsHistory from './admin/credit_trade_history/CreditTradeHistoryContainer';
import CreditTransferAddContainer from './credit_transfers/CreditTransferAddContainer';
import CreditTransferEditContainer from './credit_transfers/CreditTransferEditContainer';
import CreditTransferViewContainer from './credit_transfers/CreditTransferViewContainer';
import HistoricalDataEntryContainer from './admin/historical_data_entry/HistoricalDataEntryContainer';
import HistoricalDataEntryEditContainer from './admin/historical_data_entry/HistoricalDataEntryEditContainer';
import NotFound from './components/reusables/NotFound';
import OrganizationsContainer from './organizations/OrganizationsContainer';
import OrganizationsViewContainer from './organizations/OrganizationViewContainer';
import UserViewContainer from './users/UserViewContainer';

const Router = props => (
  <ConnectedRouter history={history} key={Math.random()}>
    <App>
      <Switch>
        <Route
          exact
          path={Routes.HOME}
          component={withRouter(GovernmentTransferContainer)}
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
          path={ORGANIZATIONS.LIST}
          component={withRouter(OrganizationsContainer)}
        />
        <Route
          exact
          path={ORGANIZATIONS.DETAILS}
          component={withRouter(OrganizationsViewContainer)}
        />
        <Route
          exact
          path={CREDIT_TRANSACTIONS.LIST}
          component={withRouter(GovernmentTransferContainer)}
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
          exact
          path={CREDIT_TRANSACTIONS.ADD_PVR}
          component={withRouter(GovernmentTransferAddContainer)}
        />
        <Route
          path={CREDIT_TRANSACTIONS.EDIT}
          component={withRouter(CreditTransferEditContainer)}
        />
        <Route
          path={CREDIT_TRANSACTIONS.EDIT_PVR}
          component={withRouter(GovernmentTransferEditContainer)}
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
        <Route component={NotFound} />
      </Switch>
    </App>
  </ConnectedRouter>
);

export default Router;
